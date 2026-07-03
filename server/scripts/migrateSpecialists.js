import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const collection = mongoose.connection.collection('treatments')

  // Find documents that still have the old string `specialist` field
  const docs = await collection.find({ specialist: { $exists: true } }).toArray()
  console.log(`Found ${docs.length} treatments with old 'specialist' field`)

  for (const doc of docs) {
    const slugs = doc.specialists?.length
      ? doc.specialists                  // already migrated
      : doc.specialist ? [doc.specialist] : []

    await collection.updateOne(
      { _id: doc._id },
      {
        $set:   { specialists: slugs },
        $unset: { specialist: '' },
      }
    )
    console.log(`  Migrated: ${doc.slug} → specialists: [${slugs.join(', ')}]`)
  }

  console.log('Migration complete')
  await mongoose.disconnect()
}

migrate().catch(err => { console.error(err); process.exit(1) })
