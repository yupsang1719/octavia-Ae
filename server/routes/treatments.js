import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getTreatments, getAllTreatmentsAdmin,
  getTreatmentBySlug, getAdminTreatmentBySlug,
  createTreatment, updateTreatment, deleteTreatment, reorderTreatments,
} from '../controllers/treatmentController.js'

const router = Router()

router.get('/',                getTreatments)
router.get('/admin/all',       requireAuth, getAllTreatmentsAdmin)    // must be before /:slug
router.get('/admin/:slug',     requireAuth, getAdminTreatmentBySlug) // must be before /:slug
router.patch('/admin/reorder', requireAuth, reorderTreatments)       // must be before /:slug
router.get('/:slug',           getTreatmentBySlug)
router.post('/',          requireAuth, createTreatment)
router.patch('/:slug',    requireAuth, updateTreatment)
router.delete('/:slug',   requireAuth, deleteTreatment)

export default router
