import Practice from '../models/Practice.js'

export async function getPractice(req, res) {
  try {
    const practice = await Practice.findOne({ slug: req.practiceSlug })
    if (!practice) return res.status(404).json({ error: 'Practice not found' })
    res.json(practice)
  } catch {
    res.status(500).json({ error: 'Failed to fetch practice' })
  }
}

export async function getPractices(req, res) {
  try {
    const practices = await Practice.find({}, 'slug name type domains').sort({ name: 1 })
    res.json(practices)
  } catch {
    res.status(500).json({ error: 'Failed to fetch practices' })
  }
}

export async function updatePractice(req, res) {
  const ALLOWED = ['name', 'address', 'phone', 'email', 'whatsapp', 'type',
                   'tagline', 'instagram', 'googleMapsUrl', 'metaTitle', 'metaDesc', 'hours']
  const update = {}
  for (const key of ALLOWED) {
    if (req.body[key] !== undefined) update[key] = req.body[key]
  }
  try {
    const practice = await Practice.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: update },
      { new: true }
    )
    if (!practice) return res.status(404).json({ error: 'Practice not found' })
    res.json(practice)
  } catch {
    res.status(500).json({ error: 'Failed to update practice' })
  }
}
