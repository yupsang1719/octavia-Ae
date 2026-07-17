import { CENTRAL_PRACTICE, TRANSFER_DESTINATIONS } from '../config/stock.js'

export function computeStatus(total, reorderLevel) {
  if (total <= reorderLevel) return 'ORDER_NOW'
  if (total <= reorderLevel * 1.5) return 'LOW'
  return 'OK'
}

function emptyBucket() {
  const bucket = { [CENTRAL_PRACTICE]: 0 }
  for (const p of TRANSFER_DESTINATIONS) bucket[p] = 0
  return bucket
}

// movements: plain objects { itemId, type, location, qty }
// Returns Map<itemIdString, { [practiceSlug]: qty, total }>
//
// goods_in always lands at Central. A transfer both removes stock from
// Central and adds it at the destination practice, even though the
// movement record only stores the destination as `location`. usage and
// adjustment both deduct at wherever they occurred (adjustment qty may be
// negative, which nets as a correction upward).
export function computeStockByItem(movements) {
  const levels = new Map()

  for (const m of movements) {
    const key = String(m.itemId)
    if (!levels.has(key)) levels.set(key, emptyBucket())
    const bucket = levels.get(key)

    switch (m.type) {
      case 'goods_in':
        bucket[CENTRAL_PRACTICE] += m.qty
        break
      case 'transfer':
        bucket[m.location] += m.qty
        bucket[CENTRAL_PRACTICE] -= m.qty
        break
      case 'usage':
      case 'adjustment':
        bucket[m.location] -= m.qty
        break
    }
  }

  for (const bucket of levels.values()) {
    bucket.total = Object.values(bucket).reduce((sum, v) => sum + v, 0)
  }

  return levels
}

// Returns one or more adjustment-movement payloads { itemId, location, qty, note }
// that exactly cancel the stock effect of `original`. A transfer touches two
// locations (destination +qty, Central -qty) so it needs two adjustments;
// goods_in and usage/adjustment only ever touch one location.
export function buildReversalMovements(original) {
  const { itemId, type, location, qty } = original
  const note = `Reversal of ${type} movement dated ${new Date(original.date).toLocaleDateString('en-GB')}`

  if (type === 'transfer') {
    return [
      { itemId, location, qty, note },
      { itemId, location: CENTRAL_PRACTICE, qty: -qty, note },
    ]
  }
  if (type === 'goods_in') {
    return [{ itemId, location: CENTRAL_PRACTICE, qty, note }]
  }
  // usage or adjustment
  return [{ itemId, location, qty: -qty, note }]
}

export function stockStatusForItem(item, stockByItem) {
  const bucket = stockByItem.get(String(item._id)) || emptyBucket()
  const total = bucket.total ?? Object.values(bucket).reduce((sum, v) => sum + v, 0)
  const status = computeStatus(total, item.reorderLevel)
  return {
    ...bucket,
    total,
    status,
    suggestedOrderQty: status === 'OK' ? 0 : item.reorderQty,
  }
}
