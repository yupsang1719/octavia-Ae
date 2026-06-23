import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getSlots, bookAppointment, getMarketingPatients, sendCampaign } from '../controllers/dentallyController.js'

const router = Router()

router.get('/slots',    requireAuth, getSlots)
router.post('/book',    requireAuth, bookAppointment)
router.get('/patients', requireAuth, getMarketingPatients)
router.post('/send',    requireAuth, sendCampaign)

export default router
