import mongoose from 'mongoose'
import { PRACTICE_SLUGS } from '../config/stock.js'
import { VISIT_TYPES } from '../config/facilities.js'

const visitSchema = new mongoose.Schema({
  practice:    { type: String, enum: PRACTICE_SLUGS, required: true, index: true },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }, // omitted for general/business visits
  visitType:   { type: String, enum: VISIT_TYPES, required: true, index: true },
  date:        { type: Date, required: true },
  contractor:  { type: String, trim: true },
  notes:       { type: String, trim: true },
  nextDueDate: { type: Date }, // manager enters this from the engineer's report — not auto-calculated

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  createdAt: { type: Date, default: Date.now },
})

// Visits are an immutable in-house compliance record — no update/delete
// routes are exposed. A mistaken entry is corrected with a new visit note,
// same philosophy as the Stock movement audit trail.

export default mongoose.model('Visit', visitSchema)
