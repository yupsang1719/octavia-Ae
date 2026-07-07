import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'

const DEFAULT = 'octavia-aesthetic'

// Slugs of dentists who appear in all 3 practices
const ALL_PRACTICES = ['octavia-aesthetic', 'octavia-house', 'new-octavia']
const SHARED_DENTIST_SLUGS = ['dr-ravi-pant', 'dr-rachayita-pant', 'dr-sadikchha-gurung']

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')
  const db = mongoose.connection

  const collections = [
    { name: 'treatments',   field: 'practice' },
    { name: 'blogposts',    field: 'practice' },
    { name: 'enquiries',    field: 'practice' },
    { name: 'galleryitems', field: 'practice' },
    { name: 'reviews',      field: 'practice' },
    { name: 'sitesettings', field: 'practice' },
  ]

  for (const { name, field } of collections) {
    const col = db.collection(name)
    const result = await col.updateMany(
      { [field]: { $exists: false } },
      { $set: { [field]: DEFAULT } }
    )
    console.log(`${name}: set ${result.modifiedCount} docs to practice='${DEFAULT}'`)
  }

  // TeamMember: set practices array
  const teamCol = db.collection('teammembers')

  // All existing members without practices → default
  const r1 = await teamCol.updateMany(
    { practices: { $exists: false } },
    { $set: { practices: [DEFAULT] } }
  )
  console.log(`teammembers: set ${r1.modifiedCount} docs to practices=['${DEFAULT}']`)

  // Shared dentists → all 3 practices
  const r2 = await teamCol.updateMany(
    { slug: { $in: SHARED_DENTIST_SLUGS } },
    { $set: { practices: ALL_PRACTICES } }
  )
  console.log(`teammembers: set ${r2.modifiedCount} shared dentists to all 3 practices`)

  console.log('\nMigration complete.')
  await mongoose.disconnect()
}

migrate().catch(err => { console.error(err); process.exit(1) })
