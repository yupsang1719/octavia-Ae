import { Router } from 'express'
import { login, getDashboard, getAllPosts, getPostById, getAllGallery, getAllTeam } from '../controllers/adminController.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { sendReviewRequest } from '../utils/email.js'

const router = Router()

router.post('/login',        authLimiter, login)
router.get('/dashboard',     requireAuth, getDashboard)
router.get('/posts',         requireAuth, getAllPosts)
router.get('/posts/:id',     requireAuth, getPostById)
router.get('/gallery',       requireAuth, getAllGallery)
router.get('/team',          requireAuth, getAllTeam)

router.post('/review-request', requireAuth, async (req, res) => {
  const { name, email, note, treatment, visitDate, clinician } = req.body
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email are required' })
  }
  try {
    await sendReviewRequest({
      name:      name.trim(),
      email:     email.trim(),
      note:      note?.trim(),
      treatment: treatment?.trim(),
      visitDate: visitDate?.trim(),
      clinician: clinician?.trim(),
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('Review request email failed:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
