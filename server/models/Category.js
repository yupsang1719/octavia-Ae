import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  // Goods In requires a batch no. + expiry date for items in this category (warn-but-allow for others)
  requiresBatchAndExpiry: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Category', categorySchema)
