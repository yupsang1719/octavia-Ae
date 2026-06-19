import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import { sendReviewRequest } from '../utils/email.js'

console.log(`API key: ${process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.slice(0, 10) + '…' : 'NOT SET'}`)
console.log('Sending review request to thenngbirash124@gmail.com…\n')

try {
  await sendReviewRequest({
    name:      'Birash Thing',
    email:     'thenngbirash124@gmail.com',
    treatment: 'Composite Bonding',
    visitDate: '16 June 2026',
    clinician: 'Dr Rachayita Pant',
    note:      'It was so lovely seeing you today — we hope you\'re already loving the results!',
  })
  console.log('✓ Email sent successfully')
} catch (err) {
  console.error('✗ Failed:', err.message)
}
