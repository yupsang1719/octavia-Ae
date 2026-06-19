import { Router } from 'express'
import { body } from 'express-validator'
import { createEnquiry, getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js'
import { requireAuth } from '../middleware/auth.js'
import { enquiryLimiter } from '../middleware/rateLimiter.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.post(
  '/',
  enquiryLimiter,
  [
    body('name').trim().notEmpty().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('gdprConsent').equals('true').withMessage('GDPR consent required'),
  ],
  validateRequest,
  createEnquiry
)

router.get('/',   requireAuth, getEnquiries)
router.patch('/:id', requireAuth, updateEnquiryStatus)

export default router
