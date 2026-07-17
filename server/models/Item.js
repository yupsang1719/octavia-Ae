import mongoose from 'mongoose'
import { ITEM_CATEGORIES, ITEM_SUPPLIERS, COUNT_TIERS } from '../config/stock.js'

const itemSchema = new mongoose.Schema({
  sku:          { type: String, required: true, unique: true, trim: true },
  name:         { type: String, required: true, unique: true, trim: true },
  category:     { type: String, enum: ITEM_CATEGORIES, required: true },
  supplier:     { type: String, enum: ITEM_SUPPLIERS, required: true },
  unit:         { type: String, required: true, trim: true },
  packSize:     { type: Number, required: true, min: 1 },
  costPerUnit:  { type: Number, required: true, min: 0 },
  reorderLevel: { type: Number, required: true, min: 0 },
  reorderQty:   { type: Number, required: true, min: 0 },
  countTier:    { type: String, enum: COUNT_TIERS, required: true },
  active:       { type: Boolean, default: true },
  notes:        { type: String, trim: true },
}, { timestamps: true })

export default mongoose.model('Item', itemSchema)
