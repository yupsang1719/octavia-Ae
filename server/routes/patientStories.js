import { Router } from 'express'
import multer from 'multer'
import { tmpdir } from 'os'
import { resolve, extname, basename } from 'path'
import PatientStory from '../models/PatientStory.js'
import { requireAuth, requireManager } from '../middleware/auth.js'
import { enqueueVideo, removeFile, STORIES_DIR } from '../services/videoProcessor.js'

const router = Router()

const VIDEO_EXTS  = new Set(['.mp4', '.mov', '.m4v', '.webm'])
const IMAGE_EXTS  = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MAX_BYTES   = 200 * 1024 * 1024

// Patient Stories are only shown on Octavia Dental & Facial Aesthetics
const STORY_PRACTICE = 'octavia-aesthetic'

// Originals go to the OS temp dir (not /uploads) so they're never publicly served
const upload = multer({
  dest: tmpdir(),
  limits: { fileSize: MAX_BYTES, files: 2 },
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase()
    if (file.fieldname === 'video' && VIDEO_EXTS.has(ext) && file.mimetype.startsWith('video/')) return cb(null, true)
    if (file.fieldname === 'poster' && IMAGE_EXTS.has(ext) && file.mimetype.startsWith('image/')) return cb(null, true)
    cb(new Error(file.fieldname === 'video'
      ? 'Video must be MP4, MOV, M4V or WebM'
      : 'Cover image must be JPEG, PNG or WebP'))
  },
})

function uploadFields(req, res, next) {
  upload.fields([{ name: 'video', maxCount: 1 }, { name: 'poster', maxCount: 1 }])(req, res, err => {
    if (!err) return next()
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File is larger than 200 MB' : err.message
    res.status(400).json({ error: msg })
  })
}

const EDITABLE = ['name', 'treatment', 'quote', 'consentRef', 'published', 'order']
function pick(body) {
  const out = {}
  for (const k of EDITABLE) if (body[k] !== undefined) out[k] = body[k]
  if (typeof out.published === 'string') out.published = out.published === 'true'
  return out
}

function storyFile(url) {
  return url ? resolve(STORIES_DIR, basename(url)) : null
}

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  if (req.practiceSlug !== STORY_PRACTICE) return res.json([])
  try {
    const filter = { published: true, status: 'ready', practices: STORY_PRACTICE }
    if (req.query.treatment) filter.treatment = String(req.query.treatment)
    const items = await PatientStory
      .find(filter, 'name treatment quote videoUrl posterUrl duration')
      .sort({ order: 1, createdAt: -1 })
      .limit(24)
    res.set('Cache-Control', 'public, max-age=300')
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch patient stories' })
  }
})

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get('/admin/all', requireAuth, requireManager, async (req, res) => {
  try {
    const items = await PatientStory.find({ practices: STORY_PRACTICE }).sort({ order: 1, createdAt: -1 })
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch patient stories' })
  }
})

router.post('/', requireAuth, requireManager, uploadFields, async (req, res) => {
  const video  = req.files?.video?.[0]
  const poster = req.files?.poster?.[0]
  if (!video) {
    removeFile(poster?.path)
    return res.status(400).json({ error: 'Please choose a video file' })
  }
  try {
    const data = { ...pick(req.body), practices: [STORY_PRACTICE] }
    const top = await PatientStory.findOne().sort({ order: 1 }).select('order').lean()
    const story = await PatientStory.create({ ...data, order: (top?.order ?? 0) - 1, status: 'processing' })
    enqueueVideo({ id: story._id.toString(), inputPath: video.path, posterPath: poster?.path })
    res.status(201).json(story)
  } catch (err) {
    removeFile(video.path); removeFile(poster?.path)
    res.status(400).json({ error: err.message })
  }
})

router.patch('/:id', requireAuth, requireManager, async (req, res) => {
  try {
    const story = await PatientStory.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true })
    if (!story) return res.status(404).json({ error: 'Story not found' })
    res.json(story)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', requireAuth, requireManager, async (req, res) => {
  try {
    const story = await PatientStory.findByIdAndDelete(req.params.id)
    if (story) { removeFile(storyFile(story.videoUrl)); removeFile(storyFile(story.posterUrl)) }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete story' })
  }
})

export default router
