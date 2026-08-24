import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import Item from '../models/Item.js'
import Category from '../models/Category.js'
import Supplier from '../models/Supplier.js'
import { COUNT_TIERS } from '../config/stock.js'

// Usage: node server/scripts/importStockItems.js <path-to-csv> [--create-missing]
//
// Reads the "New Items" sheet exported to CSV — see the Google Sheet template
// (10 columns: Item Name, Category, Supplier, Unit, Pack Size, Cost per Unit,
// Reorder Level, Reorder Qty, Count Tier, Notes). Any instruction/reference
// rows above the "Item Name,Category,..." header are ignored automatically.
//
// By default, a row whose Category or Supplier doesn't match an existing
// active one is skipped and reported — categories carry a batch/expiry flag
// that shouldn't be guessed at. Pass --create-missing to auto-create missing
// categories/suppliers instead (category gets requiresBatchAndExpiry: false;
// fix that afterwards in Items > Categories if it needs batch tracking).

const [, , csvPath, ...flags] = process.argv
const createMissing = flags.includes('--create-missing')

const EXPECTED_HEADER = 'item name'
const COLS = ['name', 'category', 'supplier', 'unit', 'packSize', 'costPerUnit', 'reorderLevel', 'reorderQty', 'countTier', 'notes']

function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') { inQuotes = false }
      else { field += c }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field); field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      rows.push(row); row = []
    } else {
      field += c
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

async function nextSku() {
  const last = await Item.findOne({ sku: /^OCT-\d+$/ }).sort({ sku: -1 }).lean()
  const lastNum = last ? parseInt(last.sku.split('-')[1], 10) : 0
  return lastNum
}

async function main() {
  if (!csvPath) {
    console.error('Usage: node server/scripts/importStockItems.js <path-to-csv> [--create-missing]')
    process.exit(1)
  }
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in your .env file')
    process.exit(1)
  }

  const raw = readFileSync(csvPath, 'utf8')
  const allRows = parseCsv(raw).filter(r => r.some(cell => cell.trim() !== ''))
  const headerIdx = allRows.findIndex(r => (r[0] || '').trim().toLowerCase() === EXPECTED_HEADER)
  if (headerIdx === -1) {
    console.error(`Could not find the header row (a row starting with "Item Name"). Check the CSV wasn't edited.`)
    process.exit(1)
  }
  const dataRows = allRows.slice(headerIdx + 1).filter(r => {
    const name = (r[0] || '').trim()
    return name && !name.toUpperCase().includes('EXAMPLE')
  })

  if (dataRows.length === 0) {
    console.log('No item rows found below the header — nothing to import.')
    process.exit(0)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log(`Connected to MongoDB. ${dataRows.length} row(s) to process${createMissing ? ' (auto-creating missing categories/suppliers)' : ''}.\n`)

  const [activeCategories, activeSuppliers] = await Promise.all([
    Category.find({ active: true }).lean(),
    Supplier.find({ active: true }).lean(),
  ])
  const categoryByLower = new Map(activeCategories.map(c => [c.name.toLowerCase(), c.name]))
  const supplierByLower = new Map(activeSuppliers.map(s => [s.name.toLowerCase(), s.name]))

  let skuCounter = await nextSku()
  const created = [], skipped = [], errors = []
  const newCategoriesSeen = new Set(), newSuppliersSeen = new Set()
  const needsCost = [], needsReorderQty = [], needsUnitReview = []

  for (let i = 0; i < dataRows.length; i++) {
    const rowNum = headerIdx + 2 + i // 1-indexed sheet row, accounting for header
    const cells = dataRows[i]
    const rec = {}
    COLS.forEach((key, idx) => { rec[key] = (cells[idx] || '').trim() })

    if (await Item.exists({ name: rec.name })) {
      skipped.push(rec.name)
      continue
    }

    const errs = []
    if (!rec.name) errs.push('Item Name is required')

    let category = categoryByLower.get(rec.category.toLowerCase())
    if (!category) {
      if (createMissing && rec.category) {
        const c = await Category.create({ name: rec.category, requiresBatchAndExpiry: false })
        category = c.name
        categoryByLower.set(category.toLowerCase(), category)
        newCategoriesSeen.add(category)
      } else {
        errs.push(`Category "${rec.category}" doesn't match an existing category`)
      }
    }

    let supplier = supplierByLower.get(rec.supplier.toLowerCase())
    if (!supplier) {
      if (createMissing && rec.supplier) {
        const s = await Supplier.create({ name: rec.supplier })
        supplier = s.name
        supplierByLower.set(supplier.toLowerCase(), supplier)
        newSuppliersSeen.add(supplier)
      } else {
        errs.push(`Supplier "${rec.supplier}" doesn't match an existing supplier`)
      }
    }

    if (!rec.unit) errs.push('Unit is required')
    else if (/^\d+$/.test(rec.unit)) needsUnitReview.push(rec.name)

    const packSize = Number(rec.packSize)
    if (!Number.isFinite(packSize) || packSize < 1) errs.push('Pack Size must be a number ≥ 1')

    let costPerUnit = 0
    if (!rec.costPerUnit) needsCost.push(rec.name)
    else {
      costPerUnit = Number(rec.costPerUnit)
      if (!Number.isFinite(costPerUnit) || costPerUnit < 0) errs.push('Cost per Unit must be a number ≥ 0')
    }

    const reorderLevel = Number(rec.reorderLevel)
    if (!Number.isFinite(reorderLevel) || reorderLevel < 0) errs.push('Reorder Level must be a number ≥ 0')

    let reorderQty = 0
    if (!rec.reorderQty) needsReorderQty.push(rec.name)
    else {
      reorderQty = Number(rec.reorderQty)
      if (!Number.isFinite(reorderQty) || reorderQty < 0) errs.push('Reorder Qty must be a number ≥ 0')
    }

    const countTier = rec.countTier.toLowerCase()
    if (!COUNT_TIERS.includes(countTier)) errs.push(`Count Tier must be one of: ${COUNT_TIERS.join(', ')}`)

    if (errs.length) {
      errors.push({ row: rowNum, name: rec.name || '(blank)', errs })
      continue
    }

    skuCounter += 1
    const sku = `OCT-${String(skuCounter).padStart(3, '0')}`
    try {
      await Item.create({
        sku, name: rec.name, category, supplier, unit: rec.unit, packSize, costPerUnit,
        reorderLevel, reorderQty, countTier, notes: rec.notes || undefined,
      })
      created.push(rec.name)
    } catch (err) {
      skuCounter -= 1
      errors.push({ row: rowNum, name: rec.name, errs: [err.code === 11000 ? 'Duplicate name' : err.message] })
    }
  }

  console.log(`Created: ${created.length}`)
  created.forEach(n => console.log(`  + ${n}`))

  if (skipped.length) {
    console.log(`\nSkipped (already exist): ${skipped.length}`)
    skipped.forEach(n => console.log(`  = ${n}`))
  }

  if (newCategoriesSeen.size) console.log(`\nNew categories created: ${[...newCategoriesSeen].join(', ')} — check whether any need "requires batch + expiry" turned on in Items > Categories.`)
  if (newSuppliersSeen.size) console.log(`New suppliers created: ${[...newSuppliersSeen].join(', ')}`)

  if (needsCost.length) console.log(`\nNeeds a real Cost per Unit (imported at £0): ${needsCost.length}\n  ${needsCost.join(', ')}`)
  if (needsReorderQty.length) console.log(`\nNeeds a real Reorder Qty (imported at 0 — won't show a suggested order qty until fixed): ${needsReorderQty.length}\n  ${needsReorderQty.join(', ')}`)
  if (needsUnitReview.length) console.log(`\nUnit is just a number, not a description (e.g. "Box of 50"): ${needsUnitReview.length}\n  ${needsUnitReview.join(', ')}`)

  if (errors.length) {
    console.log(`\nErrors: ${errors.length} row(s) not imported`)
    errors.forEach(e => console.log(`  Row ${e.row} (${e.name}): ${e.errs.join('; ')}`))
    console.log(createMissing
      ? '\nFix these rows in the sheet, re-export, and re-run — rows already imported will be skipped, not duplicated.'
      : '\nUnknown category/supplier? Add it once in Items > Categories or > Suppliers, then re-run this same command — already-imported rows are skipped, not duplicated. Or re-run with --create-missing to have the script create them for you.')
  }

  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
