import mongoose from 'mongoose'

const hourSchema = new mongoose.Schema(
  { day: String, hours: String, closed: { type: Boolean, default: false } },
  { _id: false }
)

const practiceSchema = new mongoose.Schema({
  slug:    { type: String, required: true, unique: true },
  name:    { type: String, required: true },
  domains: [String],

  address:  String,
  phone:    String,
  email:    String,
  whatsapp: String,

  type: { type: String, enum: ['private', 'nhs', 'mixed'], default: 'private' },

  tagline:     String,
  instagram:   String,
  googleMapsUrl: String,

  metaTitle: String,
  metaDesc:  String,

  // Off by default — a practice has to opt in to claiming free consultations,
  // rather than opt out. Editable from Admin → Practice Settings.
  freeConsultation: { type: Boolean, default: false },

  hours: [hourSchema],
}, { timestamps: true })

export default mongoose.model('Practice', practiceSchema)
