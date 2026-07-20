import mongoose from 'mongoose'
import { PRACTICE_SLUGS, MOVEMENT_TYPES, MOVEMENT_REASONS } from '../config/stock.js'

const stockMovementSchema = new mongoose.Schema({
  type:       { type: String, enum: MOVEMENT_TYPES, required: true, index: true },
  date:       { type: Date, required: true },
  itemId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
  qty:        { type: Number, required: true },
  location:   { type: String, enum: PRACTICE_SLUGS, required: true, index: true },

  // transfer only — the practice stock is leaving. `location` above is the destination.
  fromLocation: { type: String, enum: PRACTICE_SLUGS },

  // goods_in only
  batchNo:     { type: String, trim: true },
  expiryDate:  { type: Date },
  supplier:    { type: String, trim: true },
  invoiceRef:  { type: String, trim: true },

  // usage / adjustment only
  reason: { type: String, enum: MOVEMENT_REASONS },
  note:   { type: String, trim: true },

  // grouping keys
  deliveryId: { type: String, index: true },
  transferId: { type: String, index: true },

  // set on adjustment movements posted to reverse an earlier movement
  reversalOf: { type: mongoose.Schema.Types.ObjectId, ref: 'StockMovement' },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  createdAt: { type: Date, default: Date.now },
})

// Movements are an immutable audit trail — no update/delete routes are exposed.
// Corrections are made by posting a new adjustment movement instead.

export default mongoose.model('StockMovement', stockMovementSchema)
