import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getSlots, bookAppointment, getMarketingPatients, sendCampaign, sendSingle, getPatientAppointments, debugDentally, debugAppointments } from '../controllers/dentallyController.js'

const router = Router()

router.get('/slots',                       requireAuth, getSlots)
router.post('/book',                       requireAuth, bookAppointment)
router.get('/patients',                    requireAuth, getMarketingPatients)
router.get('/patients/:id/appointments',   requireAuth, getPatientAppointments)
router.post('/send',                       requireAuth, sendCampaign)
router.post('/send-single',                requireAuth, sendSingle)
if (process.env.NODE_ENV !== 'production') {
  router.get('/debug',              requireAuth, debugDentally)
  router.get('/debug-appointments', requireAuth, debugAppointments)
}

export default router
