import 'dotenv/config'
import mongoose from 'mongoose'
import Admin from '../models/Admin.js'

// Usage: node server/scripts/createAdmin.js <email> <password>
// Creates a 'manager' role account (full access). For a restricted staff
// account, use createStaffUser.js instead.

const [, , email, password] = process.argv

async function main() {
  if (!email || !password) {
    console.error('Usage: node server/scripts/createAdmin.js <email> <password>')
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

  const admin = new Admin({ email, password, role: 'manager' })
  await admin.save()
  console.log(`Manager account created:`)
  console.log(`  Email: ${email}`)
  console.log(`  Role:  manager`)

  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
