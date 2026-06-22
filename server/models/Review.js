import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  author:    { type: String, required: true },
  location:  { type: String },
  treatment: { type: String },
  rating:    { type: Number, min: 1, max: 5, required: true },
  text:      { type: String, default: '' },
  source:    { type: String, enum: ['google','website'], default: 'google' },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Review', reviewSchema)
