import multer from 'multer'
import { resolve, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

const __dir = dirname(fileURLToPath(import.meta.url))

function diskStorage(subfolder) {
  const dest = resolve(__dir, '../../uploads', subfolder)
  mkdirSync(dest, { recursive: true })
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-z0-9.]/gi, '-').toLowerCase()
      cb(null, `${Date.now()}-${safe}`)
    },
  })
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

function imageFilter(_req, file, cb) {
  const ext = extname(file.originalname).toLowerCase()
  if (ALLOWED_MIME.has(file.mimetype) && ALLOWED_EXTS.has(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, WebP and AVIF images are allowed'), false)
  }
}

export const teamUpload = multer({
  storage: diskStorage('team'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

export const galleryUpload = multer({
  storage: diskStorage('gallery'),
  fileFilter: imageFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
})

export const blogUpload = multer({
  storage: diskStorage('blog'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})
