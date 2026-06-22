import { Router } from 'express'
import Treatment from '../models/Treatment.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public — list all (minimal fields for ServicesGrid)
router.get('/', async (req, res) => {
  try {
    const treatments = await Treatment.find({}, 'slug name tagline priceFrom specialist order').sort({ order: 1 })
    res.json(treatments)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch treatments' })
  }
})

// Public — single treatment by slug
router.get('/:slug', async (req, res) => {
  try {
    const treatment = await Treatment.findOne({ slug: req.params.slug })
    if (!treatment) return res.status(404).json({ error: 'Not found' })
    res.json(treatment)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch treatment' })
  }
})

// Admin — update treatment
router.patch('/:slug', requireAuth, async (req, res) => {
  const allowed = ['tagline', 'priceFrom', 'priceNote', 'financeAvailable', 'whatIsIt', 'benefits', 'process', 'faq']
  const update = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key]
  }
  try {
    const treatment = await Treatment.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: update },
      { new: true }
    )
    if (!treatment) return res.status(404).json({ error: 'Not found' })
    res.json(treatment)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update treatment' })
  }
})

export default router
