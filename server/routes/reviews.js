import { Router } from 'express'
import Review from '../models/Review.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ published: true }).sort({ createdAt: -1 })
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

export default router
