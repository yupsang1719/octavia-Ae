import { Router } from 'express'
import { getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js'
import { requireAuth } from '../middleware/auth.js'

// Public submissions were retired in favour of email (mailto) enquiries.
// These admin routes stay so historical enquiries remain viewable in the CMS.
const router = Router()

router.get('/',   requireAuth, getEnquiries)
router.patch('/:id', requireAuth, updateEnquiryStatus)

export default router
