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

const priceItemSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  price: { type: String, default: '', trim: true },
  note:  { type: String, default: '', trim: true },
  href:  { type: String, default: '', trim: true },
}, { _id: false })

const priceCategorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  items:    { type: [priceItemSchema], default: [] },
}, { _id: false })

const siteSettingsSchema = new mongoose.Schema({
  practice:     { type: String, default: 'octavia-aesthetic', unique: true },
  trustBar:     { type: [trustStatSchema],   default: [] },
  openingHours: { type: [openingHourSchema], default: [] },
  priceList:    { type: [priceCategorySchema], default: [] },
}, { timestamps: true })

export default mongoose.model('SiteSettings', siteSettingsSchema)
