import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import { sendEnquiryNotification, sendEnquiryConfirmation } from '../utils/email.js'

const testEnquiry = {
  name:          'Test Patient',
  email:         process.env.EMAIL_TO,
  phone:         '07700 900000',
  service:       'Dental Implants',
  preferredTime: 'Morning',
  location:      'Godalming',
  message:       'This is a test enquiry submitted from the email test script.',
  source:        '/contact',
  gdprConsent:   true,
  createdAt:     new Date(),
}

console.log(`Sending to: ${process.env.EMAIL_TO}`)
console.log(`Via: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`)
console.log(`Auth: ${process.env.EMAIL_USER}`)
console.log('')

try {
  console.log('→ Sending staff notification...')
  await sendEnquiryNotification(testEnquiry)
  console.log('✓ Staff notification sent')

  console.log('→ Sending patient confirmation...')
  await sendEnquiryConfirmation(testEnquiry)
  console.log('✓ Patient confirmation sent')

  console.log('\nBoth emails sent successfully.')
} catch (err) {
  console.error('\n✗ Failed:', err.message)
  if (err.code) console.error('  Code:', err.code)
  if (err.response) console.error('  SMTP response:', err.response)
}
