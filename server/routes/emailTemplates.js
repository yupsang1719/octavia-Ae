import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { listTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate } from '../controllers/emailTemplateController.js'

const router = Router()

router.get('/',     requireAuth, listTemplates)
router.get('/:id',  requireAuth, getTemplate)
router.post('/',    requireAuth, createTemplate)
router.put('/:id',  requireAuth, updateTemplate)
router.delete('/:id', requireAuth, deleteTemplate)

export default router
