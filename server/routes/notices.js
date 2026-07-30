import { Router } from 'express'
import { requireAuth, requireManager } from '../middleware/auth.js'
import { getActiveNotices, listNotices, createNotice, updateNotice } from '../controllers/noticeController.js'

const router = Router()

router.get('/active', getActiveNotices) // public

router.use(requireAuth, requireManager)
router.get('/',      listNotices)
router.post('/',     createNotice)
router.patch('/:id', updateNotice)

export default router
