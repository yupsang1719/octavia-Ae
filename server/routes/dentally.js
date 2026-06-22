import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getSlots, bookAppointment } from '../controllers/dentallyController.js'

const router = Router()

router.get('/slots', requireAuth, getSlots)
router.post('/book', requireAuth, bookAppointment)

export default router
