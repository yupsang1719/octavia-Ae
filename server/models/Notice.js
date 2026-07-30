import mongoose from 'mongoose'
import { PRACTICE_SLUGS } from '../config/stock.js'

const noticeSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  message:   { type: String, required: true, trim: true },
  type:      { type: String, enum: ['popup', 'banner'], required: true },
  // 'all' shows on every practice site; otherwise scoped to one
  practice:  { type: String, enum: [...PRACTICE_SLUGS, 'all'], default: 'all' },
  image:     { type: String, trim: true },
  linkText:  { type: String, trim: true },
  linkUrl:   { type: String, trim: true },
  startDate: { type: Date },
  endDate:   { type: Date },
  active:    { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Notice', noticeSchema)
