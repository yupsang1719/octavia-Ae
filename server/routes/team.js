import { Router } from 'express'
import {
  getTeam, getTeamByCategory, getTeamMemberBySlug,
  createTeamMember, updateTeamMember, deleteTeamMember, toggleVisibility,
} from '../controllers/teamController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/',                  getTeam)
router.get('/category/:category',getTeamByCategory)
router.get('/:slug',             getTeamMemberBySlug)
router.post('/',                      requireAuth, createTeamMember)
router.patch('/:id/visibility',       requireAuth, toggleVisibility)
router.put('/:id',                    requireAuth, updateTeamMember)
router.patch('/:id',                  requireAuth, updateTeamMember)
router.delete('/:id',                 requireAuth, deleteTeamMember)

export default router
