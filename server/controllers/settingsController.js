import SiteSettings from '../models/SiteSettings.js'

const DEFAULTS = [
  { value: '500+', label: 'Happy patients' },
  { value: '5.0★', label: 'Google rating' },
  { value: '2',    label: 'Specialist dentists' },
  { value: 'Free', label: 'Consultations' },
  { value: 'None', label: 'Waiting list' },
]

const DEFAULT_HOURS = [
  { day: 'Monday – Thursday', hours: '8:30 am – 6:00 pm', closed: false },
  { day: 'Friday',            hours: '8:30 am – 5:00 pm', closed: false },
  { day: 'Saturday',          hours: '9:00 am – 2:00 pm', closed: false },
  { day: 'Sunday',            hours: '',                  closed: true  },
]

export async function getTrustBar(_req, res) {
  try {
    const settings = await SiteSettings.findOne({ key: 'main' })
    res.json(settings?.trustBar?.length ? settings.trustBar : DEFAULTS)
  } catch {
    res.json(DEFAULTS)
  }
}

export async function updateTrustBar(req, res) {
  try {
    const { stats } = req.body
    if (!Array.isArray(stats)) return res.status(400).json({ error: 'stats must be an array' })
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { trustBar: stats },
      { upsert: true, new: true }
    )
    res.json(settings.trustBar)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getOpeningHours(_req, res) {
  try {
    const settings = await SiteSettings.findOne({ key: 'main' })
    res.json(settings?.openingHours?.length ? settings.openingHours : DEFAULT_HOURS)
  } catch {
    res.json(DEFAULT_HOURS)
  }
}

export async function updateOpeningHours(req, res) {
  try {
    const { hours } = req.body
    if (!Array.isArray(hours)) return res.status(400).json({ error: 'hours must be an array' })
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { openingHours: hours },
      { upsert: true, new: true }
    )
    res.json(settings.openingHours)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
