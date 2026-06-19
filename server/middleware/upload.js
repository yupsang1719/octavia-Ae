import multer from 'multer'
import { resolve, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

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

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

function imageFilter(_req, file, cb) {
  ALLOWED.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only JPEG, PNG, WebP and AVIF images are allowed'), false)
}

export const teamUpload = multer({
  storage: diskStorage('team'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})
