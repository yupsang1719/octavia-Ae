import 'dotenv/config'
import mongoose from 'mongoose'
import Admin from '../models/Admin.js'

// Usage: node server/scripts/createStaffUser.js <email> <password>
// Creates a 'staff' role account (Count + Quick Log + read-only stock view only).
// For a full-access manager account, use createAdmin.js instead.

const [, , email, password] = process.argv

async function main() {
  if (!email || !password) {
    console.error('Usage: node server/scripts/createStaffUser.js <email> <password>')
    process.exit(1)
  }
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in your .env file')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log(`Account already exists: ${email} (role: ${existing.role})`)
    await mongoose.disconnect()
    return
  }

  const admin = new Admin({ email, password, role: 'staff' })
  await admin.save()
  console.log(`Staff account created:`)
  console.log(`  Email:    ${email}`)
  console.log(`  Password: ${password}`)
  console.log(`  Role:     staff`)

  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
