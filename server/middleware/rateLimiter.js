import rateLimit from 'express-rate-limit'

export const enquiryLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              5,
  message:          { error: 'Too many enquiries from this IP, please try again later.' },
  standardHeaders:  true,
  legacyHeaders:    false,
})

export const apiLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              100,
  standardHeaders:  true,
  legacyHeaders:    false,
})

export const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              10,
  message:          { error: 'Too many login attempts, please try again later.' },
  standardHeaders:  true,
  legacyHeaders:    false,
})
