import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { teamUpload, galleryUpload, blogUpload } from '../middleware/upload.js'

const router = Router()

router.post('/team', requireAuth, teamUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: `/uploads/team/${req.file.filename}` })
})

router.post(
  '/gallery',
  requireAuth,
  galleryUpload.fields([
    { name: 'beforeImg', maxCount: 1 },
    { name: 'afterImg',  maxCount: 1 },
  ]),
  (req, res) => {
    const urls = {}
    if (req.files?.beforeImg?.[0]) urls.beforeImg = `/uploads/gallery/${req.files.beforeImg[0].filename}`
    if (req.files?.afterImg?.[0])  urls.afterImg  = `/uploads/gallery/${req.files.afterImg[0].filename}`
    if (!Object.keys(urls).length) return res.status(400).json({ error: 'No files uploaded' })
    res.json(urls)
  },
)

router.post('/blog', requireAuth, blogUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: `/uploads/blog/${req.file.filename}` })
})

export default router
