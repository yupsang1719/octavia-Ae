import mongoose from 'mongoose'

const emailTemplateSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  subject:   { type: String, required: true },
  bodyHtml:  { type: String, required: true },
  type:      { type: String, enum: ['review_request', 'marketing'], default: 'marketing' },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('EmailTemplate', emailTemplateSchema)
