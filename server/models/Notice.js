import mongoose from 'mongoose'
import { PRACTICE_SLUGS } from '../config/stock.js'

const noticeSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  message:   { type: String, required: true, trim: true },
  type:      { type: String, enum: ['popup', 'banner'], required: true },
  // Which practice sites this shows on — all three checked = shows everywhere
  practices: {
    type: [{ type: String, enum: PRACTICE_SLUGS }],
    default: PRACTICE_SLUGS,
    validate: v => v.length > 0,
  },
  image:     { type: String, trim: true },
  linkText:  { type: String, trim: true },
  linkUrl:   { type: String, trim: true },
  startDate: { type: Date },
  endDate:   { type: Date },
  active:    { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Notice', noticeSchema)
