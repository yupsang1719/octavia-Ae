import mongoose from 'mongoose'

const patientStorySchema = new mongoose.Schema({
  name:       { type: String, required: true },   // patient first name
  treatment:  { type: String, default: '' },      // treatment slug, e.g. 'composite-bonding'
  quote:      { type: String, default: '' },      // short pull-quote shown beside the video
  consentRef: { type: String, required: true },
  practices:  { type: [String], default: ['octavia-aesthetic'], index: true },
  published:  { type: Boolean, default: false },
  order:      { type: Number, default: 0 },

  // Filled in by the background video processor
  status:     { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
  error:      { type: String, default: '' },
  videoUrl:   { type: String, default: '' },
  posterUrl:  { type: String, default: '' },
  duration:   { type: Number, default: 0 },        // seconds
  sizeBytes:  { type: Number, default: 0 },        // web copy size
}, { timestamps: true })

export default mongoose.model('PatientStory', patientStorySchema)
