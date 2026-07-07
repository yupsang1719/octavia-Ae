import mongoose from 'mongoose'

const trustStatSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
}, { _id: false })

const openingHourSchema = new mongoose.Schema({
  day:    { type: String, required: true },
  hours:  { type: String, default: '' },
  closed: { type: Boolean, default: false },
}, { _id: false })

const siteSettingsSchema = new mongoose.Schema({
  practice:     { type: String, default: 'octavia-aesthetic', unique: true },
  trustBar:     { type: [trustStatSchema],   default: [] },
  openingHours: { type: [openingHourSchema], default: [] },
}, { timestamps: true })

export default mongoose.model('SiteSettings', siteSettingsSchema)
