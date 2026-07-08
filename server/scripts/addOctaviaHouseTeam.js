import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import TeamMember from '../models/TeamMember.js'

const SLUGS = ['dr-ravi-pant', 'dr-rachayita-pant']

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  for (const slug of SLUGS) {
    const result = await TeamMember.findOneAndUpdate(
      { slug },
      { $addToSet: { practices: 'octavia-house' } },
      { new: true }
    )
    if (result) {
      console.log(`Updated ${result.name} → practices: ${result.practices.join(', ')}`)
    } else {
      console.log(`Not found: ${slug}`)
    }
  }

  await mongoose.disconnect()
  console.log('Done')
}

run().catch(err => { console.error(err); process.exit(1) })
