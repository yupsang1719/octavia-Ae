import Review from '../models/Review.js'

export async function getPublishedReviews(_req, res) {
  try {
    const reviews = await Review.find({ published: true }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}

export async function getAllReviews(_req, res) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}

export async function createReview(req, res) {
  try {
    const { author, location, treatment, rating, text, source, published } = req.body
    const review = await Review.create({ author, location, treatment, rating, text, source, published })
    res.status(201).json(review)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function updateReview(req, res) {
  try {
    const { author, location, treatment, rating, text, source, published } = req.body
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { author, location, treatment, rating, text, source, published } },
      { new: true, runValidators: true }
    )
    if (!review) return res.status(404).json({ error: 'Not found' })
    res.json(review)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function deleteReview(req, res) {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
}
