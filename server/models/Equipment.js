import mongoose from 'mongoose'
import { PRACTICE_SLUGS } from '../config/stock.js'

const equipmentSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  practice:     { type: String, enum: PRACTICE_SLUGS, required: true, index: true },
  type:         { type: String, trim: true }, // free text, e.g. "Autoclave", "Dental Chair", "Scaler"
  serialNumber: { type: String, trim: true },
  notes:        { type: String, trim: true },
  active:       { type: Boolean, default: true },
}, { timestamps: true })

equipmentSchema.index({ practice: 1, name: 1 }, { unique: true })

export default mongoose.model('Equipment', equipmentSchema)
