import { Router } from 'express'
import { requireAuth, requireManager } from '../middleware/auth.js'
import {
  listItems, createItem, updateItem,
  listCategories, createCategory, updateCategory,
  listSuppliers, createSupplier, updateSupplier,
  getDashboard, getOrderListCsv,
  createGoodsIn, listGoodsIn,
  createTransfer, listTransfers,
  getCountItems, postCount, listCounts,
  createQuickLog,
  getExpiryWatch,
  listMovements, exportMovementsCsv, reverseMovement,
} from '../controllers/stockController.js'

const router = Router()

router.use(requireAuth)

// Items admin — manager only
router.get('/items',        requireManager, listItems)
router.post('/items',       requireManager, createItem)
router.patch('/items/:id',  requireManager, updateItem)

// Categories & Suppliers — manager only
router.get('/categories',       requireManager, listCategories)
router.post('/categories',      requireManager, createCategory)
router.patch('/categories/:id', requireManager, updateCategory)
router.get('/suppliers',        requireManager, listSuppliers)
router.post('/suppliers',       requireManager, createSupplier)
router.patch('/suppliers/:id',  requireManager, updateSupplier)

// Dashboard — manager (full) + staff (read-only, filtered client-side to their practice)
router.get('/dashboard', getDashboard)
router.get('/dashboard/order-list.csv', requireManager, getOrderListCsv)

// Goods In — manager only
router.post('/goods-in', requireManager, createGoodsIn)
router.get('/goods-in',  requireManager, listGoodsIn)

// Transfers — manager only
router.post('/transfers', requireManager, createTransfer)
router.get('/transfers',  requireManager, listTransfers)

// Count — manager + staff
router.get('/count/items', getCountItems)
router.post('/count',      postCount)
router.get('/counts',      requireManager, listCounts)

// Quick Log — manager + staff
router.post('/quick-log', createQuickLog)

// Expiry Watch — manager only
router.get('/expiry', requireManager, getExpiryWatch)

// Movements (audit trail) — manager only
router.get('/movements',            requireManager, listMovements)
router.get('/movements/export.csv', requireManager, exportMovementsCsv)
router.post('/movements/:id/reverse', requireManager, reverseMovement)

export default router
