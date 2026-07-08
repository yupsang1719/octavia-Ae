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
  slug:             { type: String, required: true },
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

  specialists: [String],
  notCovers:   [String],
  type:        { type: String, enum: ['treatment', 'nhs-band'], default: 'treatment' },
  published:   { type: Boolean, default: true },
  practice:    { type: String, default: 'octavia-aesthetic', index: true },
  gdcNote:    { type: Boolean, default: false },
  rxNote:     { type: Boolean, default: false },

  order: { type: Number, default: 0 },
}, { timestamps: true })

treatmentSchema.index({ slug: 1, practice: 1 }, { unique: true })

export default mongoose.model('Treatment', treatmentSchema)
