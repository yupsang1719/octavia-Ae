import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getSlots, bookAppointment, getMarketingPatients, sendCampaign, sendSingle, getPatientAppointments, debugDentally } from '../controllers/dentallyController.js'

const router = Router()

router.get('/slots',                       requireAuth, getSlots)
router.post('/book',                       requireAuth, bookAppointment)
router.get('/patients',                    requireAuth, getMarketingPatients)
router.get('/patients/:id/appointments',   requireAuth, getPatientAppointments)
router.post('/send',                       requireAuth, sendCampaign)
router.post('/send-single',                requireAuth, sendSingle)
router.get('/debug',                       requireAuth, debugDentally)

export default router
