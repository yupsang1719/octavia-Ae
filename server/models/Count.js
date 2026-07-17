import mongoose from 'mongoose'
import { PRACTICE_SLUGS, COUNT_TIERS } from '../config/stock.js'

const countLineSchema = new mongoose.Schema({
  itemId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  expectedQty: { type: Number, required: true },
  countedQty:  { type: Number }, // null/undefined = blank = skipped
  variance:    { type: Number }, // expectedQty - countedQty, only set when counted
}, { _id: false })

const countSchema = new mongoose.Schema({
  date:      { type: Date, required: true, default: Date.now },
  practice:  { type: String, enum: PRACTICE_SLUGS, required: true, index: true },
  tier:      { type: String, enum: COUNT_TIERS, required: true }, // 'weekly' tab or 'monthly' (full count) tab
  countedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  lines:     [countLineSchema],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Count', countSchema)
