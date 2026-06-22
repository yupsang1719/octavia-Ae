import mongoose from 'mongoose'

const trustStatSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
}, { _id: false })

const siteSettingsSchema = new mongoose.Schema({
  key:      { type: String, default: 'main', unique: true },
  trustBar: { type: [trustStatSchema], default: [] },
}, { timestamps: true })

export default mongoose.model('SiteSettings', siteSettingsSchema)
