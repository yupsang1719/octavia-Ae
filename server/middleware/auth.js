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
    const admin = await Admin.findById(payload.id).select('_id email role').lean()
    if (!admin) return res.status(401).json({ error: 'Unauthorised' })
    // .lean() skips schema defaults, so accounts created before the `role`
    // field existed would otherwise come back with role: undefined.
    req.admin = { ...admin, role: admin.role || 'manager' }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireManager(req, res, next) {
  if (req.admin?.role !== 'manager') {
    return res.status(403).json({ error: 'Manager access required' })
  }
  next()
}
