import TeamMember from '../models/TeamMember.js'

export async function getTeam(req, res) {
  try {
    const members = await TeamMember.find({ published: true }).sort({ order: 1, createdAt: 1 })
    res.json(members)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team' })
  }
}

export async function getTeamByCategory(req, res) {
  try {
    const members = await TeamMember.find({ category: req.params.category, published: true }).sort({ order: 1 })
    res.json(members)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team' })
  }
}

export async function getTeamMemberBySlug(req, res) {
  try {
    const member = await TeamMember.findOne({ slug: req.params.slug, published: true })
    if (!member) return res.status(404).json({ error: 'Team member not found' })
    res.json(member)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team member' })
  }
}

export async function createTeamMember(req, res) {
  try {
    const member = await TeamMember.create(req.body)
    res.status(201).json(member)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function updateTeamMember(req, res) {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!member) return res.status(404).json({ error: 'Team member not found' })
    res.json(member)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function deleteTeamMember(req, res) {
  try {
    await TeamMember.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete team member' })
  }
}
