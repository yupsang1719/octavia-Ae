import mongoose from 'mongoose'

const processStepSchema = new mongoose.Schema(
  { step: Number, title: String, body: String },
  { _id: false }
)

const faqSchema = new mongoose.Schema(
  { q: String, a: String },
  { _id: false }
)

const treatmentSchema = new mongoose.Schema({
  slug:             { type: String, required: true, unique: true },
  name:             String,
  tagline:          String,
  priceFrom:        String,
  priceNote:        String,
  financeAvailable: { type: Boolean, default: false },

  h1:       String,
  title:    String,
  metaDesc: String,
  heroImage:String,

  whatIsIt:  [String],
  benefits:  [String],
  process:   [processStepSchema],
  faq:       [faqSchema],

  specialist: String,
  gdcNote:    { type: Boolean, default: false },
  rxNote:     { type: Boolean, default: false },

  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Treatment', treatmentSchema)
