import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Supplier', supplierSchema)
