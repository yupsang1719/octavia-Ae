import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiLimiter } from './middleware/rateLimiter.js'
import enquiryRoutes from './routes/enquiries.js'
import blogRoutes    from './routes/blog.js'
import galleryRoutes from './routes/gallery.js'
import reviewRoutes  from './routes/reviews.js'
import dentallyRoutes from './routes/dentally.js'
import adminRoutes   from './routes/admin.js'
import teamRoutes    from './routes/team.js'
import uploadRoutes    from './routes/upload.js'
import settingsRoutes       from './routes/settings.js'
import treatmentRoutes     from './routes/treatments.js'
import emailTemplateRoutes from './routes/emailTemplates.js'
import { generateSitemap } from './utils/sitemapGenerator.js'

const __dir = dirname(fileURLToPath(import.meta.url))

const app = express()

// Compression — gzip all responses, skip small payloads
app.use(compression({ threshold: 1024 }))

// Security
app.use(helmet({
  strictTransportSecurity: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true }
    : false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:      ["'self'", 'data:', 'https:', 'blob:'],
      frameSrc:    ["'self'", 'https://maps.google.com', 'https://www.google.com', 'https://maps.googleapis.com'],
      connectSrc:  ["'self'", 'https://maps.googleapis.com', 'https://maps.google.com'],
    },
  },
}))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

// Serve uploaded files
app.use('/uploads', express.static(resolve(__dir, '../uploads')))

// Body parsing
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Global rate limit
app.use('/api', apiLimiter)

// Routes
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/blog',      blogRoutes)
app.use('/api/gallery',   galleryRoutes)
app.use('/api/reviews',   reviewRoutes)
app.use('/api/dentally',  dentallyRoutes)
app.use('/api/admin',     adminRoutes)
app.use('/api/team',      teamRoutes)
app.use('/api/upload',    uploadRoutes)
app.use('/api/settings',        settingsRoutes)
app.use('/api/treatments',      treatmentRoutes)
app.use('/api/email-templates', emailTemplateRoutes)

// Sitemap — cached for 24h
app.get('/sitemap.xml', async (req, res) => {
  try {
    const xml = await generateSitemap()
    res.set('Content-Type', 'application/xml')
    res.set('Cache-Control', 'public, max-age=86400')
    res.send(xml)
  } catch {
    res.status(500).send('Failed to generate sitemap')
  }
})

// Cache-control for API responses
app.use('/api/blog',    (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=300'); next() })
app.use('/api/gallery', (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=300'); next() })
app.use('/api/reviews', (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=300'); next() })

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = resolve(__dir, '../client/dist')
  app.use(express.static(clientDist, { maxAge: '1y', index: false }))
  app.get('*', (req, res) => res.sendFile(resolve(clientDist, 'index.html')))
} else {
  app.use((req, res) => res.status(404).json({ error: 'Not found' }))
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  const msg = process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Internal server error')
  res.status(err.status || 500).json({ error: msg })
})

export default app
