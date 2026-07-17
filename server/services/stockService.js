import Item from '../models/Item.js'
import StockMovement from '../models/StockMovement.js'
import { CENTRAL_PRACTICE } from '../config/stock.js'
import { computeStockByItem, stockStatusForItem } from './stockCalc.js'

export async function getStockByItem(itemIds) {
  const filter = itemIds ? { itemId: { $in: itemIds } } : {}
  const movements = await StockMovement.find(filter, 'itemId type location qty').lean()
  return computeStockByItem(movements)
}

export async function getDashboardData() {
  const items = await Item.find({ active: true }).sort({ category: 1, name: 1 }).lean()
  const stockByItem = await getStockByItem(items.map(i => i._id))
  return items.map(item => ({ ...item, stock: stockStatusForItem(item, stockByItem) }))
}

export async function getItemStock(itemId) {
  const stockByItem = await getStockByItem([itemId])
  return stockByItem.get(String(itemId)) || null
}

export async function getCentralStock(itemId) {
  const stock = await getItemStock(itemId)
  return stock ? stock[CENTRAL_PRACTICE] : 0
}
