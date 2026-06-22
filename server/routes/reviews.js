import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getPublishedReviews, getAllReviews,
  createReview, updateReview, deleteReview,
} from '../controllers/reviewController.js'

const router = Router()

router.get('/',      getPublishedReviews)
router.get('/all',   requireAuth, getAllReviews)
router.post('/',     requireAuth, createReview)
router.patch('/:id', requireAuth, updateReview)
router.delete('/:id',requireAuth, deleteReview)

export default router
