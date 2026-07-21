import Admin from '../models/Admin.js'

const ROLES = ['manager', 'staff']

export async function listUsers(_req, res) {
  try {
    const users = await Admin.find().select('email role active createdAt').sort({ createdAt: 1 })
    res.json(users)
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

export async function createUser(req, res) {
  try {
    const { email, password, role } = req.body
    if (!email?.trim()) return res.status(422).json({ error: 'Email is required' })
    if (!password || password.length < 8) return res.status(422).json({ error: 'Password must be at least 8 characters' })
    if (!ROLES.includes(role)) return res.status(422).json({ error: 'Invalid role' })

    const user = new Admin({ email: email.trim().toLowerCase(), password, role })
    await user.save()
    res.status(201).json({ _id: user._id, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'An account with that email already exists' })
    res.status(500).json({ error: 'Failed to create user' })
  }
}

async function activeManagerCount(excludeId) {
  return Admin.countDocuments({ role: 'manager', active: { $ne: false }, _id: { $ne: excludeId } })
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params
    const { role, active } = req.body

    if (id === String(req.admin._id)) {
      return res.status(400).json({ error: "You can't change your own role or access from here" })
    }

    const user = await Admin.findById(id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const demotingFromManager = role === 'staff' && user.role === 'manager'
    const deactivating = active === false && user.active !== false
    if ((demotingFromManager || deactivating) && user.role === 'manager') {
      const remaining = await activeManagerCount(user._id)
      if (remaining === 0) {
        return res.status(400).json({ error: 'At least one active manager account must remain' })
      }
    }

    if (role !== undefined) {
      if (!ROLES.includes(role)) return res.status(422).json({ error: 'Invalid role' })
      user.role = role
    }
    if (active !== undefined) user.active = !!active

    await user.save()
    res.json({ _id: user._id, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt })
  } catch {
    res.status(500).json({ error: 'Failed to update user' })
  }
}

export async function resetUserPassword(req, res) {
  try {
    const { id } = req.params
    const { password } = req.body
    if (!password || password.length < 8) return res.status(422).json({ error: 'Password must be at least 8 characters' })

    const user = await Admin.findById(id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.password = password
    await user.save()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to reset password' })
  }
}
