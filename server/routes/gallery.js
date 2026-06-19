import { Router } from 'express'
import { getGallery, getGalleryByTreatment, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/',                    getGallery)
router.get('/:treatment',          getGalleryByTreatment)
router.post('/',                   requireAuth, createGalleryItem)
router.patch('/:id',               requireAuth, updateGalleryItem)
router.delete('/:id',              requireAuth, deleteGalleryItem)

export default router
