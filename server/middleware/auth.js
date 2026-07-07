import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised' })
  }
  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await Admin.findById(payload.id).select('_id email').lean()
    if (!admin) return res.status(401).json({ error: 'Unauthorised' })
    req.admin = admin
    // Authenticated admins can scope requests to any practice via header
    const VALID_SLUGS = ['octavia-aesthetic', 'octavia-house', 'new-octavia']
    const adminPractice = req.headers['x-admin-practice']
    if (adminPractice && VALID_SLUGS.includes(adminPractice)) {
      req.practiceSlug = adminPractice
    }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
