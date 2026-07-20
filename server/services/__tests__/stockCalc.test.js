import { describe, it, expect } from 'vitest'
import {
  computeStatus,
  computeStockByItem,
  stockStatusForItem,
  buildReversalMovements,
} from '../stockCalc.js'

const ITEM_ID = 'item-1'

describe('computeStatus', () => {
  it('flags ORDER_NOW when total is at or below reorderLevel', () => {
    expect(computeStatus(4, 4)).toBe('ORDER_NOW')
    expect(computeStatus(2, 4)).toBe('ORDER_NOW')
  })

  it('flags LOW when total is above reorderLevel but at or below 1.5x', () => {
    expect(computeStatus(6, 4)).toBe('LOW')
  })

  it('flags OK above the 1.5x threshold', () => {
    expect(computeStatus(7, 4)).toBe('OK')
  })
})

describe('computeStockByItem', () => {
  it('adds goods_in at Central', () => {
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['octavia-house']).toBe(10)
    expect(bucket.total).toBe(10)
  })

  it('reduces Central and increases the destination on a transfer with no fromLocation (legacy data)', () => {
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'transfer', location: 'new-octavia', qty: 4 },
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['octavia-house']).toBe(6)
    expect(bucket['new-octavia']).toBe(4)
    expect(bucket.total).toBe(10) // transfers move stock, never create or destroy it
  })

  it('moves stock directly between two spoke practices', () => {
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'transfer', location: 'new-octavia', qty: 6, fromLocation: 'octavia-house' },
      { itemId: ITEM_ID, type: 'transfer', location: 'octavia-aesthetic', qty: 2, fromLocation: 'new-octavia' },
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['octavia-house']).toBe(4)
    expect(bucket['new-octavia']).toBe(4)
    expect(bucket['octavia-aesthetic']).toBe(2)
    expect(bucket.total).toBe(10)
  })

  it('moves stock from a spoke back into Central', () => {
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'transfer', location: 'new-octavia', qty: 4, fromLocation: 'octavia-house' },
      { itemId: ITEM_ID, type: 'transfer', location: 'octavia-house', qty: 1, fromLocation: 'new-octavia' },
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['octavia-house']).toBe(7)
    expect(bucket['new-octavia']).toBe(3)
    expect(bucket.total).toBe(10)
  })

  it('deducts usage at the practice where it occurred', () => {
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'transfer', location: 'new-octavia', qty: 4 },
      { itemId: ITEM_ID, type: 'usage', location: 'new-octavia', qty: 1 },
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['new-octavia']).toBe(3)
    expect(bucket.total).toBe(9)
  })

  it('treats a negative adjustment qty as a correction upward', () => {
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'adjustment', location: 'octavia-house', qty: -3 },
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['octavia-house']).toBe(13)
  })

  it('treats a positive adjustment qty as a correction downward', () => {
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'adjustment', location: 'octavia-house', qty: 3 },
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['octavia-house']).toBe(7)
  })
})

describe('stockStatusForItem', () => {
  it('suggests the reorderQty when below OK, and nothing when OK', () => {
    const item = { _id: ITEM_ID, reorderLevel: 4, reorderQty: 8 }
    const low = computeStockByItem([{ itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 5 }])
    expect(stockStatusForItem(item, low).status).toBe('LOW')
    expect(stockStatusForItem(item, low).suggestedOrderQty).toBe(8)

    const ok = computeStockByItem([{ itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 20 }])
    expect(stockStatusForItem(item, ok).status).toBe('OK')
    expect(stockStatusForItem(item, ok).suggestedOrderQty).toBe(0)
  })

  it('returns zeroed stock for an item with no movements', () => {
    const item = { _id: 'no-movements', reorderLevel: 4, reorderQty: 8 }
    const result = stockStatusForItem(item, new Map())
    expect(result.total).toBe(0)
    expect(result.status).toBe('ORDER_NOW')
  })
})

describe('buildReversalMovements', () => {
  it('reverses a goods_in with a single Central adjustment', () => {
    const original = { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10, date: new Date() }
    const [adj] = buildReversalMovements(original)
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'adjustment', ...adj },
    ])
    expect(levels.get(ITEM_ID).total).toBe(0)
  })

  it('reverses a transfer with two adjustments, restoring both sides', () => {
    const original = { itemId: ITEM_ID, type: 'transfer', location: 'new-octavia', qty: 4, date: new Date() }
    const reversal = buildReversalMovements(original)
    expect(reversal).toHaveLength(2)

    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'transfer', location: 'new-octavia', qty: 4 },
      ...reversal.map(a => ({ itemId: ITEM_ID, type: 'adjustment', ...a })),
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['octavia-house']).toBe(10)
    expect(bucket['new-octavia']).toBe(0)
  })

  it('reverses a spoke-to-spoke transfer using its stored fromLocation, not Central', () => {
    const original = {
      itemId: ITEM_ID, type: 'transfer', location: 'octavia-aesthetic',
      fromLocation: 'new-octavia', qty: 2, date: new Date(),
    }
    const reversal = buildReversalMovements(original)
    expect(reversal).toHaveLength(2)

    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'goods_in', location: 'octavia-house', qty: 10 },
      { itemId: ITEM_ID, type: 'transfer', location: 'new-octavia', qty: 6, fromLocation: 'octavia-house' },
      { itemId: ITEM_ID, type: 'transfer', location: 'octavia-aesthetic', qty: 2, fromLocation: 'new-octavia' },
      ...reversal.map(a => ({ itemId: ITEM_ID, type: 'adjustment', ...a })),
    ])
    const bucket = levels.get(ITEM_ID)
    expect(bucket['new-octavia']).toBe(6) // restored — Central untouched by this reversal
    expect(bucket['octavia-aesthetic']).toBe(0)
    expect(bucket['octavia-house']).toBe(4)
  })

  it('reverses usage by restoring the deducted qty at the same location', () => {
    const original = { itemId: ITEM_ID, type: 'usage', location: 'octavia-aesthetic', qty: 2, date: new Date() }
    const [adj] = buildReversalMovements(original)
    const levels = computeStockByItem([
      { itemId: ITEM_ID, type: 'transfer', location: 'octavia-aesthetic', qty: 5 },
      { itemId: ITEM_ID, type: 'usage', location: 'octavia-aesthetic', qty: 2 },
      { itemId: ITEM_ID, type: 'adjustment', ...adj },
    ])
    expect(levels.get(ITEM_ID)['octavia-aesthetic']).toBe(5)
  })
})
