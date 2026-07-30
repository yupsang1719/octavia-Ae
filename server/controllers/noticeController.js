import Notice from '../models/Notice.js'
import { PRACTICE_SLUGS } from '../config/stock.js'

const NOTICE_TYPES = ['popup', 'banner']
const PRACTICE_VALUES = [...PRACTICE_SLUGS, 'all']

// Public — notices currently live for the requesting practice (resolved from hostname)
export async function getActiveNotices(req, res) {
  try {
    const now = new Date()
    const filter = {
      active: true,
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
        { $or: [{ practice: 'all' }, { practice: req.practiceSlug }] },
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
    if (PRACTICE_VALUES.includes(req.query.practice)) filter.practice = req.query.practice
    const notices = await Notice.find(filter).sort({ createdAt: -1 }).lean()
    res.json(notices)
  } catch {
    res.status(500).json({ error: 'Failed to fetch notices' })
  }
}

export async function createNotice(req, res) {
  try {
    const { title, message, type, practice, image, linkText, linkUrl, startDate, endDate } = req.body
    if (!title?.trim()) return res.status(422).json({ error: 'Title is required' })
    if (!message?.trim()) return res.status(422).json({ error: 'Message is required' })
    if (!NOTICE_TYPES.includes(type)) return res.status(422).json({ error: 'Invalid type' })
    const practiceValue = practice || 'all'
    if (!PRACTICE_VALUES.includes(practiceValue)) return res.status(422).json({ error: 'Invalid practice' })

    const notice = await Notice.create({
      title: title.trim(), message: message.trim(), type, practice: practiceValue,
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
    const allowed = ['title', 'message', 'type', 'practice', 'image', 'linkText', 'linkUrl', 'startDate', 'endDate', 'active']
    const updates = {}
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key]
    if (updates.type && !NOTICE_TYPES.includes(updates.type)) return res.status(422).json({ error: 'Invalid type' })
    if (updates.practice && !PRACTICE_VALUES.includes(updates.practice)) return res.status(422).json({ error: 'Invalid practice' })
    if (updates.startDate === '') updates.startDate = null
    if (updates.endDate === '') updates.endDate = null

    const notice = await Notice.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!notice) return res.status(404).json({ error: 'Notice not found' })
    res.json(notice)
  } catch {
    res.status(500).json({ error: 'Failed to update notice' })
  }
}
