import Treatment from '../models/Treatment.js'

function toSlug(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Public — only published treatments (treats missing `published` field as published for backward compat)
export async function getTreatments(req, res) {
  try {
    const treatments = await Treatment
      .find({ practice: req.practiceSlug, published: { $ne: false } }, 'slug name tagline priceFrom specialists order')
      .sort({ order: 1 })
    res.json(treatments)
  } catch {
    res.status(500).json({ error: 'Failed to fetch treatments' })
  }
}

// Admin — all treatments including drafts
export async function getAllTreatmentsAdmin(req, res) {
  try {
    const treatments = await Treatment
      .find({ practice: req.practiceSlug }, 'slug name tagline priceFrom published order')
      .sort({ order: 1 })
    res.json(treatments)
  } catch {
    res.status(500).json({ error: 'Failed to fetch treatments' })
  }
}

export async function getTreatmentBySlug(req, res) {
  try {
    const treatment = await Treatment.findOne({
      slug: req.params.slug,
      practice: req.practiceSlug,
      published: { $ne: false },
    })
    if (!treatment) return res.status(404).json({ error: 'Not found' })
    res.json(treatment)
  } catch {
    res.status(500).json({ error: 'Failed to fetch treatment' })
  }
}

// Admin only — returns draft treatments too
export async function getAdminTreatmentBySlug(req, res) {
  try {
    const treatment = await Treatment.findOne({ slug: req.params.slug, practice: req.practiceSlug })
    if (!treatment) return res.status(404).json({ error: 'Not found' })
    res.json(treatment)
  } catch {
    res.status(500).json({ error: 'Failed to fetch treatment' })
  }
}

export async function createTreatment(req, res) {
  const { name, slug: customSlug } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' })

  const slug = customSlug?.trim() ? toSlug(customSlug) : toSlug(name)
  try {
    const treatment = await Treatment.create({
      name: name.trim(),
      slug,
      practice: req.practiceSlug,
      published: false,  // starts as draft
    })
    res.status(201).json(treatment)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'A treatment with that slug already exists for this practice' })
    res.status(400).json({ error: err.message })
  }
}

const ALLOWED_FIELDS = [
  'name', 'tagline', 'priceFrom', 'priceNote', 'financeAvailable',
  'whatIsIt', 'benefits', 'process', 'faq', 'specialists',
  'published', 'nhsBand', 'nhsPrice', 'h1', 'title', 'metaDesc', 'heroImage',
]

export async function updateTreatment(req, res) {
  const update = {}
  for (const key of ALLOWED_FIELDS) {
    if (req.body[key] !== undefined) update[key] = req.body[key]
  }
  try {
    const treatment = await Treatment.findOneAndUpdate(
      { slug: req.params.slug, practice: req.practiceSlug },
      { $set: update },
      { new: true }
    )
    if (!treatment) return res.status(404).json({ error: 'Not found' })
    res.json(treatment)
  } catch {
    res.status(500).json({ error: 'Failed to update treatment' })
  }
}

export async function reorderTreatments(req, res) {
  const { slugs } = req.body
  if (!Array.isArray(slugs)) return res.status(400).json({ error: 'slugs must be an array' })
  try {
    await Promise.all(slugs.map((slug, i) =>
      Treatment.updateOne({ slug, practice: req.practiceSlug }, { $set: { order: i } })
    ))
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to reorder treatments' })
  }
}

export async function deleteTreatment(req, res) {
  try {
    const result = await Treatment.findOneAndDelete({ slug: req.params.slug, practice: req.practiceSlug })
    if (!result) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete treatment' })
  }
}
