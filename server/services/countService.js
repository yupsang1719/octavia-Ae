import StockMovement from '../models/StockMovement.js'
import Count from '../models/Count.js'
import { getStockByItem } from './stockService.js'
import { reconcileCount } from './countCalc.js'

// entries: [{ itemId, countedQty }] from the client (blank/omitted = skipped)
export async function submitCount({ practice, tier, countedBy, entries }) {
  const itemIds = entries.map(e => e.itemId)
  const stockByItem = await getStockByItem(itemIds)

  const lines = entries.map(({ itemId, countedQty }) => {
    const stock = stockByItem.get(String(itemId))
    const expectedQty = stock ? stock[practice] : 0
    return { itemId, expectedQty, countedQty: countedQty === '' ? null : countedQty }
  })

  const { lines: resultLines, adjustments, summary } = reconcileCount(lines)

  const count = await Count.create({
    practice,
    tier,
    countedBy,
    lines: resultLines,
  })

  const date = new Date()
  if (adjustments.length) {
    await StockMovement.insertMany(
      adjustments.map(a => ({
        type: 'adjustment',
        date,
        itemId: a.itemId,
        qty: a.qty,
        location: practice,
        reason: a.reason,
        note: a.note,
        createdBy: countedBy,
        createdAt: date,
      }))
    )
  }

  return { count, summary }
}
