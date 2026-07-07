import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getTreatments, getAllTreatmentsAdmin,
  getTreatmentBySlug, createTreatment, updateTreatment, deleteTreatment,
} from '../controllers/treatmentController.js'

const router = Router()

router.get('/',           getTreatments)
router.get('/admin/all',  requireAuth, getAllTreatmentsAdmin)  // must be before /:slug
router.get('/:slug',      getTreatmentBySlug)
router.post('/',          requireAuth, createTreatment)
router.patch('/:slug',    requireAuth, updateTreatment)
router.delete('/:slug',   requireAuth, deleteTreatment)

export default router
