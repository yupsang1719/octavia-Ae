import mongoose from 'mongoose'
import { COUNT_TIERS } from '../config/stock.js'

const itemSchema = new mongoose.Schema({
  sku:          { type: String, required: true, unique: true, trim: true },
  name:         { type: String, required: true, unique: true, trim: true },
  // Validated against the live Category/Supplier collections in the controller,
  // not a fixed enum — both are manager-editable via Items > Categories/Suppliers.
  category:     { type: String, required: true, trim: true },
  supplier:     { type: String, required: true, trim: true },
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
