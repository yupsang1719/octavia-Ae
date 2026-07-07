import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getPractice, getPractices, updatePractice } from '../controllers/practiceController.js'

const router = Router()

router.get('/',              getPractice)           // current practice (by hostname)
router.get('/all',           requireAuth, getPractices)  // list all — admin only
router.patch('/:slug',       requireAuth, updatePractice)

export default router
