import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getTreatments, getTreatmentBySlug, updateTreatment } from '../controllers/treatmentController.js'

const router = Router()

router.get('/',        getTreatments)
router.get('/:slug',   getTreatmentBySlug)
router.patch('/:slug', requireAuth, updateTreatment)

export default router
