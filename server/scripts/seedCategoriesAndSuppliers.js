import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Supplier from '../models/Supplier.js'

// Matches the category/supplier strings already stored on the 50 seeded
// items — upserting by name keeps existing items validating.
const CATEGORIES = [
  { name: 'Anaesthetics',              requiresBatchAndExpiry: true },
  { name: 'Restorative',               requiresBatchAndExpiry: false },
  { name: 'Impressions',               requiresBatchAndExpiry: false },
  { name: 'Endodontics',               requiresBatchAndExpiry: true },
  { name: 'Hygiene & Prevention',      requiresBatchAndExpiry: false },
  { name: 'Infection Control & PPE',   requiresBatchAndExpiry: false },
  { name: 'Surgical & Sundries',       requiresBatchAndExpiry: false },
  { name: 'Surgical & Implants',       requiresBatchAndExpiry: false },
  { name: 'Whitening & Aesthetics',    requiresBatchAndExpiry: false },
  { name: 'Facial Aesthetics',         requiresBatchAndExpiry: true },
]

const SUPPLIERS = ['Hague Dental Supplies', 'Henry Schein Dental', 'Other']

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  for (const c of CATEGORIES) {
    await Category.findOneAndUpdate({ name: c.name }, c, { upsert: true, new: true, setDefaultsOnInsert: true })
    console.log(`  Category: ${c.name}${c.requiresBatchAndExpiry ? ' (requires batch + expiry)' : ''}`)
  }

  for (const name of SUPPLIERS) {
    await Supplier.findOneAndUpdate({ name }, { name }, { upsert: true, new: true, setDefaultsOnInsert: true })
    console.log(`  Supplier: ${name}`)
  }

  console.log('Done')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
