import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getTreatments, getNHSBands,
  getAllTreatmentsAdmin, getAllNHSBandsAdmin,
  getTreatmentBySlug, getAdminTreatmentBySlug,
  createTreatment, updateTreatment, deleteTreatment, reorderTreatments,
} from '../controllers/treatmentController.js'

const router = Router()

router.get('/',                    getTreatments)
router.get('/nhs-bands',           getNHSBands)                       // public — before /:slug
router.get('/admin/all',           requireAuth, getAllTreatmentsAdmin)
router.get('/admin/nhs-bands',     requireAuth, getAllNHSBandsAdmin)  // before /admin/:slug
router.get('/admin/:slug',         requireAuth, getAdminTreatmentBySlug)
router.patch('/admin/reorder',     requireAuth, reorderTreatments)
router.get('/:slug',               getTreatmentBySlug)
router.post('/',          requireAuth, createTreatment)
router.patch('/:slug',    requireAuth, updateTreatment)
router.delete('/:slug',   requireAuth, deleteTreatment)

export default router
