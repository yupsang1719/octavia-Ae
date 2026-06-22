import Treatment from '../models/Treatment.js'

export async function getTreatments(_req, res) {
  try {
    const treatments = await Treatment.find({}, 'slug name tagline priceFrom specialist order').sort({ order: 1 })
    res.json(treatments)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch treatments' })
  }
}

export async function getTreatmentBySlug(req, res) {
  try {
    const treatment = await Treatment.findOne({ slug: req.params.slug })
    if (!treatment) return res.status(404).json({ error: 'Not found' })
    res.json(treatment)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch treatment' })
  }
}

const ALLOWED_FIELDS = ['tagline', 'priceFrom', 'priceNote', 'financeAvailable', 'whatIsIt', 'benefits', 'process', 'faq']

export async function updateTreatment(req, res) {
  const update = {}
  for (const key of ALLOWED_FIELDS) {
    if (req.body[key] !== undefined) update[key] = req.body[key]
  }
  try {
    const treatment = await Treatment.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: update },
      { new: true }
    )
    if (!treatment) return res.status(404).json({ error: 'Not found' })
    res.json(treatment)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update treatment' })
  }
}
