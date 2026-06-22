import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getTrustBar, updateTrustBar, getOpeningHours, updateOpeningHours } from '../controllers/settingsController.js'

const router = Router()

router.get('/trust-bar',      getTrustBar)
router.put('/trust-bar',      requireAuth, updateTrustBar)

router.get('/opening-hours',  getOpeningHours)
router.put('/opening-hours',  requireAuth, updateOpeningHours)

export default router
