import { Router } from 'express'
import SiteSettings from '../models/SiteSettings.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const DEFAULTS = [
  { value: '500+', label: 'Happy patients' },
  { value: '5.0★', label: 'Google rating' },
  { value: '2',    label: 'Specialist dentists' },
  { value: 'Free', label: 'Consultations' },
  { value: 'None', label: 'Waiting list' },
]

router.get('/trust-bar', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({ key: 'main' })
    res.json(settings?.trustBar?.length ? settings.trustBar : DEFAULTS)
  } catch {
    res.json(DEFAULTS)
  }
})

router.put('/trust-bar', requireAuth, async (req, res) => {
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
})

export default router
