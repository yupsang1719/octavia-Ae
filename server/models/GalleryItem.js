import mongoose from 'mongoose'

const galleryItemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  treatment:   { type: String, required: true },
  beforeImg:   { type: String },
  afterImg:    { type: String },
  description: { type: String },
  consentRef:  { type: String, required: true },
  published:   { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now },
})

export default mongoose.model('GalleryItem', galleryItemSchema)
