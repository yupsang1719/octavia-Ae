import mongoose from 'mongoose'
import Item from '../models/Item.js'
import StockMovement from '../models/StockMovement.js'
import Count from '../models/Count.js'
import {
  PRACTICE_SLUGS,
  CENTRAL_PRACTICE,
  ITEM_CATEGORIES,
  ITEM_SUPPLIERS,
  BATCH_REQUIRED_CATEGORIES,
  COUNT_TIERS,
} from '../config/stock.js'
import { getDashboardData, getStockByItem } from '../services/stockService.js'
import { buildReversalMovements } from '../services/stockCalc.js'
import { submitCount } from '../services/countService.js'

function isFutureDate(date) {
  const d = new Date(date)
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)
  return isNaN(d.getTime()) || d > endOfToday
}

function toCsv(rows, columns) {
  const header = columns.map(c => c.label).join(',')
  const escape = v => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = rows.map(row => columns.map(c => escape(c.value(row))).join(','))
  return [header, ...lines].join('\n')
}

// ── Items admin ──────────────────────────────────────────────────────────

export async function listItems(req, res) {
  try {
    const filter = {}
    if (req.query.active !== undefined) filter.active = req.query.active === 'true'
    if (req.query.category && ITEM_CATEGORIES.includes(req.query.category)) filter.category = req.query.category
    if (req.query.supplier && ITEM_SUPPLIERS.includes(req.query.supplier)) filter.supplier = req.query.supplier
    const items = await Item.find(filter).sort({ category: 1, name: 1 })
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch items' })
  }
}

async function nextSku() {
  const last = await Item.findOne({ sku: /^OCT-\d+$/ }).sort({ sku: -1 }).lean()
  const lastNum = last ? parseInt(last.sku.split('-')[1], 10) : 0
  return `OCT-${String(lastNum + 1).padStart(3, '0')}`
}

export async function createItem(req, res) {
  try {
    const { name, category, supplier, unit, packSize, costPerUnit, reorderLevel, reorderQty, countTier, notes } = req.body

    if (!name?.trim()) return res.status(422).json({ error: 'Name is required' })
    if (!ITEM_CATEGORIES.includes(category)) return res.status(422).json({ error: 'Invalid category' })
    if (!ITEM_SUPPLIERS.includes(supplier)) return res.status(422).json({ error: 'Invalid supplier' })
    if (!COUNT_TIERS.includes(countTier)) return res.status(422).json({ error: 'Invalid count tier' })
    for (const [field, val] of Object.entries({ packSize, costPerUnit, reorderLevel, reorderQty })) {
      if (typeof val !== 'number' || val < 0) return res.status(422).json({ error: `${field} must be a positive number` })
    }

    const sku = await nextSku()
    const item = await Item.create({
      sku, name: name.trim(), category, supplier, unit, packSize, costPerUnit,
      reorderLevel, reorderQty, countTier, notes,
    })
    res.status(201).json(item)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'An item with that name already exists' })
    res.status(500).json({ error: 'Failed to create item' })
  }
}

export async function updateItem(req, res) {
  try {
    const allowed = ['name', 'category', 'supplier', 'unit', 'packSize', 'costPerUnit', 'reorderLevel', 'reorderQty', 'countTier', 'active', 'notes']
    const updates = {}
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key]

    const item = await Item.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!item) return res.status(404).json({ error: 'Item not found' })
    res.json(item)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'An item with that name already exists' })
    res.status(500).json({ error: 'Failed to update item' })
  }
}

// ── Dashboard ────────────────────────────────────────────────────────────

export async function getDashboard(req, res) {
  try {
    const data = await getDashboardData()
    let items = data
    if (req.query.status) items = items.filter(i => i.stock.status === req.query.status)
    if (req.query.category && ITEM_CATEGORIES.includes(req.query.category)) items = items.filter(i => i.category === req.query.category)
    if (req.query.supplier && ITEM_SUPPLIERS.includes(req.query.supplier)) items = items.filter(i => i.supplier === req.query.supplier)

    const stockValue = data.reduce((sum, i) => sum + i.stock.total * i.costPerUnit, 0)
    res.json({ items, stockValue })
  } catch {
    res.status(500).json({ error: 'Failed to load dashboard' })
  }
}

export async function getOrderListCsv(_req, res) {
  try {
    const data = await getDashboardData()
    const rows = data.filter(i => i.stock.status !== 'OK')
    const csv = toCsv(rows, [
      { label: 'SKU', value: r => r.sku },
      { label: 'Name', value: r => r.name },
      { label: 'Supplier', value: r => r.supplier },
      { label: 'Status', value: r => r.stock.status },
      { label: 'Total Stock', value: r => r.stock.total },
      { label: 'Reorder Level', value: r => r.reorderLevel },
      { label: 'Suggested Order Qty', value: r => r.stock.suggestedOrderQty },
      { label: 'Unit', value: r => r.unit },
    ])
    res.set('Content-Type', 'text/csv')
    res.set('Content-Disposition', 'attachment; filename="order-list.csv"')
    res.send(csv)
  } catch {
    res.status(500).json({ error: 'Failed to export order list' })
  }
}

// ── Goods In ─────────────────────────────────────────────────────────────

export async function createGoodsIn(req, res) {
  try {
    const { date, supplier, invoiceRef, lines } = req.body
    if (!date || isFutureDate(date)) return res.status(422).json({ error: 'Date is required and cannot be in the future' })
    if (!supplier?.trim()) return res.status(422).json({ error: 'Supplier is required' })
    if (!Array.isArray(lines) || lines.length === 0) return res.status(422).json({ error: 'At least one line is required' })

    const items = await Item.find({ _id: { $in: lines.map(l => l.itemId) } }).lean()
    const itemsById = new Map(items.map(i => [String(i._id), i]))

    for (const line of lines) {
      const item = itemsById.get(String(line.itemId))
      if (!item) return res.status(422).json({ error: 'Unknown item in delivery' })
      if (typeof line.qty !== 'number' || line.qty <= 0) return res.status(422).json({ error: `Quantity must be positive for ${item.name}` })
      if (BATCH_REQUIRED_CATEGORIES.includes(item.category) && (!line.batchNo?.trim() || !line.expiryDate)) {
        return res.status(422).json({ error: `Batch number and expiry date are required for ${item.name}` })
      }
    }

    const deliveryId = new mongoose.Types.ObjectId().toString()
    const now = new Date()
    await StockMovement.insertMany(lines.map(line => ({
      type: 'goods_in',
      date,
      itemId: line.itemId,
      qty: line.qty,
      location: CENTRAL_PRACTICE,
      batchNo: line.batchNo?.trim(),
      expiryDate: line.expiryDate || undefined,
      supplier: supplier.trim(),
      invoiceRef: invoiceRef?.trim(),
      deliveryId,
      createdBy: req.admin._id,
      createdAt: now,
    })))

    res.status(201).json({ deliveryId })
  } catch {
    res.status(500).json({ error: 'Failed to record delivery' })
  }
}

export async function listGoodsIn(_req, res) {
  try {
    const movements = await StockMovement.find({ type: 'goods_in' })
      .sort({ date: -1, createdAt: -1 })
      .populate('itemId', 'name sku unit')
      .lean()

    const deliveries = new Map()
    for (const m of movements) {
      if (!deliveries.has(m.deliveryId)) {
        deliveries.set(m.deliveryId, {
          deliveryId: m.deliveryId, date: m.date, supplier: m.supplier, invoiceRef: m.invoiceRef, lines: [],
        })
      }
      deliveries.get(m.deliveryId).lines.push({
        item: m.itemId, qty: m.qty, batchNo: m.batchNo, expiryDate: m.expiryDate, movementId: m._id,
      })
    }
    res.json([...deliveries.values()])
  } catch {
    res.status(500).json({ error: 'Failed to fetch delivery history' })
  }
}

// ── Transfers ────────────────────────────────────────────────────────────

export async function createTransfer(req, res) {
  try {
    const { source, destination, date, lines, override } = req.body
    if (!PRACTICE_SLUGS.includes(source)) return res.status(422).json({ error: 'Invalid source practice' })
    if (!PRACTICE_SLUGS.includes(destination)) return res.status(422).json({ error: 'Invalid destination practice' })
    if (source === destination) return res.status(422).json({ error: 'Source and destination must be different practices' })
    if (!date || isFutureDate(date)) return res.status(422).json({ error: 'Date is required and cannot be in the future' })
    if (!Array.isArray(lines) || lines.length === 0) return res.status(422).json({ error: 'At least one line is required' })

    const items = await Item.find({ _id: { $in: lines.map(l => l.itemId) } }).lean()
    const itemsById = new Map(items.map(i => [String(i._id), i]))
    const stockByItem = await getStockByItem(lines.map(l => l.itemId))

    const warnings = []
    for (const line of lines) {
      const item = itemsById.get(String(line.itemId))
      if (!item) return res.status(422).json({ error: 'Unknown item in transfer' })
      if (typeof line.qty !== 'number' || line.qty <= 0) return res.status(422).json({ error: `Quantity must be positive for ${item.name}` })

      const sourceStock = stockByItem.get(String(line.itemId))?.[source] ?? 0
      if (line.qty > sourceStock) {
        if (!override) {
          return res.status(409).json({
            error: `Insufficient stock for ${item.name} at the source practice (have ${sourceStock}, requested ${line.qty})`,
            code: 'INSUFFICIENT_STOCK',
          })
        }
        warnings.push(`${item.name}: transferred ${line.qty} against source stock of ${sourceStock}`)
      }
    }

    const transferId = new mongoose.Types.ObjectId().toString()
    const now = new Date()
    await StockMovement.insertMany(lines.map(line => ({
      type: 'transfer',
      date,
      itemId: line.itemId,
      qty: line.qty,
      location: destination,
      fromLocation: source,
      transferId,
      createdBy: req.admin._id,
      createdAt: now,
    })))

    res.status(201).json({ transferId, warnings })
  } catch {
    res.status(500).json({ error: 'Failed to record transfer' })
  }
}

export async function listTransfers(_req, res) {
  try {
    const movements = await StockMovement.find({ type: 'transfer' })
      .sort({ date: -1, createdAt: -1 })
      .populate('itemId', 'name sku unit')
      .lean()

    const transfers = new Map()
    for (const m of movements) {
      if (!transfers.has(m.transferId)) {
        transfers.set(m.transferId, {
          transferId: m.transferId, date: m.date,
          source: m.fromLocation || CENTRAL_PRACTICE, destination: m.location, lines: [],
        })
      }
      transfers.get(m.transferId).lines.push({ item: m.itemId, qty: m.qty, movementId: m._id })
    }
    res.json([...transfers.values()])
  } catch {
    res.status(500).json({ error: 'Failed to fetch transfer history' })
  }
}

// ── Count ────────────────────────────────────────────────────────────────

export async function getCountItems(req, res) {
  try {
    const { practice, tier } = req.query
    if (!PRACTICE_SLUGS.includes(practice)) return res.status(422).json({ error: 'Invalid practice' })
    if (!COUNT_TIERS.includes(tier)) return res.status(422).json({ error: 'Invalid tier' })

    const filter = { active: true }
    if (tier === 'weekly') filter.countTier = 'weekly'
    const items = await Item.find(filter, 'name unit category').sort({ category: 1, name: 1 }).lean()
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to load count sheet' })
  }
}

export async function postCount(req, res) {
  try {
    const { practice, tier, entries } = req.body
    if (!PRACTICE_SLUGS.includes(practice)) return res.status(422).json({ error: 'Invalid practice' })
    if (!COUNT_TIERS.includes(tier)) return res.status(422).json({ error: 'Invalid tier' })
    if (!Array.isArray(entries) || entries.length === 0) return res.status(422).json({ error: 'No count lines submitted' })
    for (const e of entries) {
      if (e.countedQty !== null && e.countedQty !== undefined && e.countedQty !== '' && (typeof e.countedQty !== 'number' || e.countedQty < 0)) {
        return res.status(422).json({ error: 'Counted quantities must be zero or positive' })
      }
    }

    const { count, summary } = await submitCount({ practice, tier, countedBy: req.admin._id, entries })
    res.status(201).json({ countId: count._id, summary })
  } catch {
    res.status(500).json({ error: 'Failed to submit count' })
  }
}

export async function listCounts(req, res) {
  try {
    const filter = {}
    if (req.query.practice && PRACTICE_SLUGS.includes(req.query.practice)) filter.practice = req.query.practice
    const counts = await Count.find(filter)
      .sort({ date: -1 })
      .populate('lines.itemId', 'name sku unit')
      .populate('countedBy', 'email')
      .lean()
    res.json(counts)
  } catch {
    res.status(500).json({ error: 'Failed to fetch count history' })
  }
}

// ── Quick Log ────────────────────────────────────────────────────────────

export async function createQuickLog(req, res) {
  try {
    const { practice, itemId, qty, reason, note } = req.body
    if (!PRACTICE_SLUGS.includes(practice)) return res.status(422).json({ error: 'Invalid practice' })
    if (!['used', 'wasted', 'expired', 'damaged'].includes(reason)) return res.status(422).json({ error: 'Invalid reason' })
    if (typeof qty !== 'number' || qty <= 0) return res.status(422).json({ error: 'Quantity must be positive' })

    const item = await Item.findById(itemId).lean()
    if (!item) return res.status(422).json({ error: 'Unknown item' })

    const movement = await StockMovement.create({
      type: 'usage',
      date: new Date(),
      itemId,
      qty,
      location: practice,
      reason,
      note: note?.trim(),
      createdBy: req.admin._id,
    })
    res.status(201).json(movement)
  } catch {
    res.status(500).json({ error: 'Failed to log usage' })
  }
}

// ── Expiry Watch ─────────────────────────────────────────────────────────

export async function getExpiryWatch(_req, res) {
  try {
    const movements = await StockMovement.find({ type: 'goods_in', expiryDate: { $ne: null } })
      .sort({ expiryDate: 1 })
      .populate('itemId', 'name sku unit')
      .lean()

    const now = new Date()
    const rows = movements.map(m => {
      const daysToExpiry = Math.ceil((new Date(m.expiryDate) - now) / (1000 * 60 * 60 * 24))
      let flag = 'OK'
      if (daysToExpiry < 0) flag = 'EXPIRED'
      else if (daysToExpiry <= 30) flag = 'EXPIRED_SOON'
      else if (daysToExpiry <= 60) flag = 'WATCH'
      return { ...m, daysToExpiry, flag }
    })
    res.json(rows)
  } catch {
    res.status(500).json({ error: 'Failed to load expiry watch' })
  }
}

// ── Movements (audit trail) ─────────────────────────────────────────────

function buildMovementFilter(query) {
  const filter = {}
  if (query.itemId) filter.itemId = query.itemId
  if (query.location && PRACTICE_SLUGS.includes(query.location)) {
    // For transfers, "at this practice" means it either sent or received stock.
    filter.$or = [{ location: query.location }, { fromLocation: query.location }]
  }
  if (query.type) filter.type = query.type
  if (query.from || query.to) {
    filter.date = {}
    if (query.from) filter.date.$gte = new Date(query.from)
    if (query.to) filter.date.$lte = new Date(query.to)
  }
  return filter
}

export async function listMovements(req, res) {
  try {
    const filter = buildMovementFilter(req.query)
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 50))

    const [movements, total] = await Promise.all([
      StockMovement.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        .populate('itemId', 'name sku unit').populate('createdBy', 'email').lean(),
      StockMovement.countDocuments(filter),
    ])
    res.json({ movements, total, page, pages: Math.ceil(total / limit) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch movements' })
  }
}

export async function exportMovementsCsv(req, res) {
  try {
    const filter = buildMovementFilter(req.query)
    const movements = await StockMovement.find(filter).sort({ date: -1 })
      .populate('itemId', 'name sku').populate('createdBy', 'email').lean()

    const csv = toCsv(movements, [
      { label: 'Date', value: r => new Date(r.date).toLocaleDateString('en-GB') },
      { label: 'Type', value: r => r.type },
      { label: 'SKU', value: r => r.itemId?.sku },
      { label: 'Item', value: r => r.itemId?.name },
      { label: 'Qty', value: r => r.qty },
      { label: 'From', value: r => r.type === 'transfer' ? (r.fromLocation || '') : '' },
      { label: 'Location', value: r => r.location },
      { label: 'Reason', value: r => r.reason || '' },
      { label: 'Batch No', value: r => r.batchNo || '' },
      { label: 'Expiry', value: r => r.expiryDate ? new Date(r.expiryDate).toLocaleDateString('en-GB') : '' },
      { label: 'Note', value: r => r.note || '' },
      { label: 'Created By', value: r => r.createdBy?.email || '' },
    ])
    res.set('Content-Type', 'text/csv')
    res.set('Content-Disposition', 'attachment; filename="stock-movements.csv"')
    res.send(csv)
  } catch {
    res.status(500).json({ error: 'Failed to export movements' })
  }
}

export async function reverseMovement(req, res) {
  try {
    const original = await StockMovement.findById(req.params.id).lean()
    if (!original) return res.status(404).json({ error: 'Movement not found' })

    const payloads = buildReversalMovements(original)
    const now = new Date()
    const created = await StockMovement.insertMany(payloads.map(p => ({
      type: 'adjustment',
      date: now,
      itemId: p.itemId,
      qty: p.qty,
      location: p.location,
      note: p.note,
      reversalOf: original._id,
      createdBy: req.admin._id,
      createdAt: now,
    })))
    res.status(201).json(created)
  } catch {
    res.status(500).json({ error: 'Failed to reverse movement' })
  }
}
