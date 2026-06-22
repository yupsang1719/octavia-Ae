import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getTrustBar, updateTrustBar } from '../controllers/settingsController.js'

const router = Router()

router.get('/trust-bar', getTrustBar)
router.put('/trust-bar', requireAuth, updateTrustBar)

export default router
