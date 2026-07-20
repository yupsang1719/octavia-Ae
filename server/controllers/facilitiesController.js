import Equipment from '../models/Equipment.js'
import Visit from '../models/Visit.js'
import { PRACTICE_SLUGS } from '../config/stock.js'
import { VISIT_TYPES } from '../config/facilities.js'
import { computeDueSoon } from '../services/facilitiesCalc.js'

function isFutureDate(date) {
  const d = new Date(date)
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)
  return isNaN(d.getTime()) || d > endOfToday
}

// ── Equipment ────────────────────────────────────────────────────────────

export async function listEquipment(req, res) {
  try {
    const filter = {}
    if (req.query.practice && PRACTICE_SLUGS.includes(req.query.practice)) filter.practice = req.query.practice
    if (req.query.active !== undefined) filter.active = req.query.active === 'true'
    const equipment = await Equipment.find(filter).sort({ practice: 1, name: 1 })
    res.json(equipment)
  } catch {
    res.status(500).json({ error: 'Failed to fetch equipment' })
  }
}

export async function createEquipment(req, res) {
  try {
    const { name, practice, type, serialNumber, notes } = req.body
    if (!name?.trim()) return res.status(422).json({ error: 'Name is required' })
    if (!PRACTICE_SLUGS.includes(practice)) return res.status(422).json({ error: 'Invalid practice' })

    const equipment = await Equipment.create({ name: name.trim(), practice, type, serialNumber, notes })
    res.status(201).json(equipment)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Equipment with that name already exists at this practice' })
    res.status(500).json({ error: 'Failed to create equipment' })
  }
}

export async function updateEquipment(req, res) {
  try {
    const allowed = ['name', 'practice', 'type', 'serialNumber', 'notes', 'active']
    const updates = {}
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key]
    if (updates.practice && !PRACTICE_SLUGS.includes(updates.practice)) return res.status(422).json({ error: 'Invalid practice' })

    const equipment = await Equipment.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' })
    res.json(equipment)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Equipment with that name already exists at this practice' })
    res.status(500).json({ error: 'Failed to update equipment' })
  }
}

// ── Visits ───────────────────────────────────────────────────────────────

export async function createVisit(req, res) {
  try {
    const { practice, equipmentId, visitType, date, contractor, notes, nextDueDate } = req.body
    if (!PRACTICE_SLUGS.includes(practice)) return res.status(422).json({ error: 'Invalid practice' })
    if (!VISIT_TYPES.includes(visitType)) return res.status(422).json({ error: 'Invalid visit type' })
    if (!date || isFutureDate(date)) return res.status(422).json({ error: 'Date is required and cannot be in the future' })
    if (nextDueDate && new Date(nextDueDate) < new Date(date)) {
      return res.status(422).json({ error: 'Next due date cannot be before the visit date' })
    }
    if (equipmentId) {
      const equipment = await Equipment.findById(equipmentId).lean()
      if (!equipment) return res.status(422).json({ error: 'Unknown equipment' })
      if (equipment.practice !== practice) return res.status(422).json({ error: 'Equipment belongs to a different practice' })
    }

    const visit = await Visit.create({
      practice, equipmentId: equipmentId || undefined, visitType, date,
      contractor: contractor?.trim(), notes: notes?.trim(),
      nextDueDate: nextDueDate || undefined,
      createdBy: req.admin._id,
    })
    res.status(201).json(visit)
  } catch {
    res.status(500).json({ error: 'Failed to log visit' })
  }
}

export async function listVisits(req, res) {
  try {
    const filter = {}
    if (req.query.practice && PRACTICE_SLUGS.includes(req.query.practice)) filter.practice = req.query.practice
    if (req.query.visitType && VISIT_TYPES.includes(req.query.visitType)) filter.visitType = req.query.visitType
    if (req.query.equipmentId) filter.equipmentId = req.query.equipmentId

    const visits = await Visit.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .populate('equipmentId', 'name type')
      .populate('createdBy', 'email')
      .lean()
    res.json(visits)
  } catch {
    res.status(500).json({ error: 'Failed to fetch visits' })
  }
}

export async function getDueSoon(_req, res) {
  try {
    const visits = await Visit.find({ nextDueDate: { $ne: null } })
      .sort({ date: -1 })
      .populate('equipmentId', 'name type')
      .lean()
    // computeDueSoon groups by equipmentId as a plain string — populate()
    // replaces that field with an object, so pull the id out separately
    // and keep the populated doc under `equipment` for display.
    const normalized = visits.map(v => ({
      ...v,
      equipmentId: v.equipmentId?._id ? String(v.equipmentId._id) : null,
      equipment: v.equipmentId || null,
    }))
    res.json(computeDueSoon(normalized))
  } catch {
    res.status(500).json({ error: 'Failed to load due-soon list' })
  }
}
