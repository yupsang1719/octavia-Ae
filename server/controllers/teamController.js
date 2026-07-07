import TeamMember from '../models/TeamMember.js'

const publicFilter = slug => ({
  published: true,
  practices: slug,
  hiddenInPractices: { $ne: slug },
})

export async function getTeam(req, res) {
  try {
    const members = await TeamMember.find(publicFilter(req.practiceSlug)).sort({ order: 1, createdAt: 1 })
    res.json(members)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team' })
  }
}

export async function getTeamByCategory(req, res) {
  try {
    const members = await TeamMember.find({ category: req.params.category, ...publicFilter(req.practiceSlug) }).sort({ order: 1 })
    res.json(members)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team' })
  }
}

export async function getTeamMemberBySlug(req, res) {
  try {
    const member = await TeamMember.findOne({ slug: req.params.slug, ...publicFilter(req.practiceSlug) })
    if (!member) return res.status(404).json({ error: 'Team member not found' })
    res.json(member)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team member' })
  }
}

export async function createTeamMember(req, res) {
  try {
    const body = { ...req.body }
    if (!Array.isArray(body.practices) || body.practices.length === 0) {
      body.practices = [req.practiceSlug]
    }
    const member = await TeamMember.create(body)
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

export async function toggleVisibility(req, res) {
  const { visible } = req.body
  const op = visible
    ? { $pull: { hiddenInPractices: req.practiceSlug } }
    : { $addToSet: { hiddenInPractices: req.practiceSlug } }
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, op, { new: true })
    if (!member) return res.status(404).json({ error: 'Team member not found' })
    res.json(member)
  } catch {
    res.status(500).json({ error: 'Failed to update visibility' })
  }
}

export async function reorderTeam(req, res) {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' })
  try {
    await Promise.all(ids.map((id, i) => TeamMember.updateOne({ _id: id }, { $set: { order: i } })))
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to reorder team' })
  }
}

export async function deleteTeamMember(req, res) {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) return res.status(404).json({ error: 'Team member not found' })

    const otherPractices = member.practices.filter(p => p !== req.practiceSlug)
    if (otherPractices.length > 0) {
      // Shared across practices — only unlink from this one
      await TeamMember.findByIdAndUpdate(req.params.id, { practices: otherPractices })
    } else {
      await TeamMember.findByIdAndDelete(req.params.id)
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete member' })
  }
}
