import { describe, it, expect } from 'vitest'
import { reconcileCount } from '../countCalc.js'

describe('reconcileCount', () => {
  it('produces no adjustment when counted matches expected', () => {
    const { adjustments, summary } = reconcileCount([
      { itemId: 'a', expectedQty: 10, countedQty: 10 },
    ])
    expect(adjustments).toHaveLength(0)
    expect(summary).toEqual({ adjusted: 0, matched: 1, skipped: 0, total: 1 })
  })

  it('posts a positive-qty adjustment (consumption) when counted is lower than expected', () => {
    const { adjustments } = reconcileCount([
      { itemId: 'a', expectedQty: 10, countedQty: 7 },
    ])
    expect(adjustments).toEqual([
      { itemId: 'a', qty: 3, reason: 'count_adjustment', note: 'Count: expected 10, counted 7' },
    ])
  })

  it('posts a negative-qty adjustment (surplus found) when an over-count occurs', () => {
    const { adjustments } = reconcileCount([
      { itemId: 'a', expectedQty: 10, countedQty: 15 },
    ])
    expect(adjustments).toEqual([
      { itemId: 'a', qty: -5, reason: 'count_adjustment', note: 'Count: expected 10, counted 15' },
    ])
  })

  it('skips blank lines and excludes them from adjusted/matched tallies', () => {
    const { adjustments, lines, summary } = reconcileCount([
      { itemId: 'a', expectedQty: 10, countedQty: null },
      { itemId: 'b', expectedQty: 5, countedQty: undefined },
      { itemId: 'c', expectedQty: 2, countedQty: '' },
    ])
    expect(adjustments).toHaveLength(0)
    expect(summary).toEqual({ adjusted: 0, matched: 0, skipped: 3, total: 3 })
    expect(lines.every(l => l.countedQty === null && l.variance === null)).toBe(true)
  })

  it('handles a mixed batch: matched, adjusted, and skipped together', () => {
    const { summary, adjustments } = reconcileCount([
      { itemId: 'a', expectedQty: 10, countedQty: 10 }, // matched
      { itemId: 'b', expectedQty: 4, countedQty: 2 },   // under-count -> +2 adjustment
      { itemId: 'c', expectedQty: 1, countedQty: 6 },   // over-count -> -5 adjustment
      { itemId: 'd', expectedQty: 3, countedQty: null }, // skipped
    ])
    expect(summary).toEqual({ adjusted: 2, matched: 1, skipped: 1, total: 4 })
    expect(adjustments.map(a => a.qty)).toEqual([2, -5])
  })

  it('treats zero as a valid count, not a blank', () => {
    const { summary, adjustments } = reconcileCount([
      { itemId: 'a', expectedQty: 3, countedQty: 0 },
    ])
    expect(summary.skipped).toBe(0)
    expect(adjustments).toEqual([
      { itemId: 'a', qty: 3, reason: 'count_adjustment', note: 'Count: expected 3, counted 0' },
    ])
  })
})
