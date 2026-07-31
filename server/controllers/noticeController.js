import Notice from '../models/Notice.js'
import { PRACTICE_SLUGS } from '../config/stock.js'

const NOTICE_TYPES = ['popup', 'banner']

function validPractices(arr) {
  return Array.isArray(arr) && arr.length > 0 && arr.every(p => PRACTICE_SLUGS.includes(p))
}

// Public — notices currently live for the requesting practice (resolved from hostname)
export async function getActiveNotices(req, res) {
  try {
    const now = new Date()
    const filter = {
      active: true,
      practices: req.practiceSlug,
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
      ],
    }

    const notices = await Notice.find(filter).sort({ createdAt: -1 }).lean()
    res.json(notices)
  } catch {
    res.status(500).json({ error: 'Failed to fetch notices' })
  }
}

export async function listNotices(req, res) {
  try {
    const filter = {}
    if (PRACTICE_SLUGS.includes(req.query.practice)) filter.practices = req.query.practice
    const notices = await Notice.find(filter).sort({ createdAt: -1 }).lean()
    res.json(notices)
  } catch {
    res.status(500).json({ error: 'Failed to fetch notices' })
  }
}

export async function createNotice(req, res) {
  try {
    const { title, message, type, practices, image, linkText, linkUrl, startDate, endDate } = req.body
    if (!title?.trim()) return res.status(422).json({ error: 'Title is required' })
    if (!message?.trim()) return res.status(422).json({ error: 'Message is required' })
    if (!NOTICE_TYPES.includes(type)) return res.status(422).json({ error: 'Invalid type' })
    if (!validPractices(practices)) return res.status(422).json({ error: 'Select at least one practice' })

    const notice = await Notice.create({
      title: title.trim(), message: message.trim(), type, practices,
      image, linkText, linkUrl,
      startDate: startDate || undefined, endDate: endDate || undefined,
    })
    res.status(201).json(notice)
  } catch {
    res.status(500).json({ error: 'Failed to create notice' })
  }
}

export async function updateNotice(req, res) {
  try {
    const allowed = ['title', 'message', 'type', 'practices', 'image', 'linkText', 'linkUrl', 'startDate', 'endDate', 'active']
    const updates = {}
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key]
    if (updates.type && !NOTICE_TYPES.includes(updates.type)) return res.status(422).json({ error: 'Invalid type' })
    if (updates.practices && !validPractices(updates.practices)) return res.status(422).json({ error: 'Select at least one practice' })
    if (updates.startDate === '') updates.startDate = null
    if (updates.endDate === '') updates.endDate = null

    const notice = await Notice.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!notice) return res.status(404).json({ error: 'Notice not found' })
    res.json(notice)
  } catch {
    res.status(500).json({ error: 'Failed to update notice' })
  }
}
