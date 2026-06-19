import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { teamUpload } from '../middleware/upload.js'

const router = Router()

router.post('/team', requireAuth, teamUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: `/uploads/team/${req.file.filename}` })
})

export default router
