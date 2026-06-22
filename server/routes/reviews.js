import { Router } from 'express'
import Review from '../models/Review.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public — published only
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ published: true }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

// Admin — all reviews
router.get('/all', requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const review = await Review.create(req.body)
    res.status(201).json(review)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!review) return res.status(404).json({ error: 'Not found' })
    res.json(review)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

export default router
