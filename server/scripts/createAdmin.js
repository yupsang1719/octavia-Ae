import 'dotenv/config'
import mongoose from 'mongoose'
import Admin from '../models/Admin.js'

const EMAIL    = 'info@octavia-dental.co.uk'
const PASSWORD = 'OctaviaAdmin2026!'

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in your .env file')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const existing = await Admin.findOne({ email: EMAIL })
  if (existing) {
    console.log(`Admin already exists: ${EMAIL}`)
    await mongoose.disconnect()
    return
  }

  const admin = new Admin({ email: EMAIL, password: PASSWORD })
  await admin.save()
  console.log(`Admin created:`)
  console.log(`  Email:    ${EMAIL}`)
  console.log(`  Password: ${PASSWORD}`)
  console.log(`\nChange this password after first login.`)

  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
