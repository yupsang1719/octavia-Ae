import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getPractice, getPracticeBySlug, getPractices, updatePractice } from '../controllers/practiceController.js'

const router = Router()

router.get('/',              getPractice)
router.get('/all',           requireAuth, getPractices)
router.get('/:slug',         requireAuth, getPracticeBySlug)
router.patch('/:slug',       requireAuth, updatePractice)

export default router
