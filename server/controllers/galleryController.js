import GalleryItem from '../models/GalleryItem.js'
import { cloudinary } from '../config/cloudinary.js'

export async function getGallery(req, res) {
  try {
    const items = await GalleryItem.find({ published: true }).sort({ createdAt: -1 })
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch gallery' })
  }
}

export async function getGalleryByTreatment(req, res) {
  try {
    const items = await GalleryItem.find({ treatment: req.params.treatment, published: true })
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch gallery' })
  }
}

export async function createGalleryItem(req, res) {
  try {
    const item = await GalleryItem.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function updateGalleryItem(req, res) {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!item) return res.status(404).json({ error: 'Item not found' })
    res.json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function deleteGalleryItem(req, res) {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete item' })
  }
}
