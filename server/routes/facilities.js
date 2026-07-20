import { Router } from 'express'
import { requireAuth, requireManager } from '../middleware/auth.js'
import {
  listEquipment, createEquipment, updateEquipment,
  createVisit, listVisits,
  getDueSoon,
} from '../controllers/facilitiesController.js'

const router = Router()

router.use(requireAuth, requireManager)

router.get('/equipment',       listEquipment)
router.post('/equipment',      createEquipment)
router.patch('/equipment/:id', updateEquipment)

router.post('/visits', createVisit)
router.get('/visits',  listVisits)

router.get('/due-soon', getDueSoon)

export default router
