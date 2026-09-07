import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { apiLimiter } from './middleware/rateLimiter.js'
import { resolvePractice } from './middleware/practice.js'
import { getCachedPractice } from './utils/practiceCache.js'
import practiceRoutes from './routes/practice.js'
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
import stockRoutes from './routes/stock.js'
import facilitiesRoutes from './routes/facilities.js'
import noticeRoutes from './routes/notices.js'
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
const ALLOWED_ORIGINS = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',').map(s => s.trim())

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    // Accept both www and non-www variants of any allowed origin
    const stripped = origin.replace(/^(https?:\/\/)www\./, '$1')
    const allowed = ALLOWED_ORIGINS.some(o => o === origin || o.replace(/^(https?:\/\/)www\./, '$1') === stripped)
    if (allowed) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// Resolve which practice this request belongs to (based on hostname)
app.use(resolvePractice)

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
app.use('/api/practice',        practiceRoutes)
app.use('/api/stock',           stockRoutes)
app.use('/api/facilities',      facilitiesRoutes)
app.use('/api/notices',         noticeRoutes)

// Sitemap — cached for 24h
app.get('/sitemap.xml', async (req, res) => {
  try {
    const xml = await generateSitemap(req.practiceSlug)
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

// Temporary debug — shows raw treatments from MongoDB, no filters
app.get('/api/debug/treatments', async (req, res) => {
  try {
    const Treatment = (await import('./models/Treatment.js')).default
    const docs = await Treatment.find({}, 'slug name practice published tagline priceFrom').lean()
    res.json({ practiceSlug: req.practiceSlug, count: docs.length, docs })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = resolve(__dir, '../client/dist')
  const indexTemplate = readFileSync(resolve(clientDist, 'index.html'), 'utf-8')

  app.use(express.static(clientDist, { maxAge: '1y', index: false }))

  // Stamp the correct practice's data into the page server-side, keyed off the
  // hostname resolved by resolvePractice. This means the browser never has to
  // make a client-side call just to find out which practice it's looking at —
  // so a slow network or the API rate limiter can no longer make the site
  // briefly display the wrong practice's name/phone/address.
  app.get('*', async (req, res) => {
    let practice = null
    try {
      practice = await getCachedPractice(req.practiceSlug)
    } catch {
      // fall through and serve the template unstamped; client-side fetch covers it
    }

    if (!practice) {
      res.set('Cache-Control', 'no-store')
      return res.send(indexTemplate)
    }

    const json = JSON.stringify(practice).replace(/</g, '\\u003c')
    const html = indexTemplate.replace('</head>', `<script>window.__PRACTICE__=${json}</script></head>`)
    res.set('Cache-Control', 'no-store')
    res.send(html)
  })
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
