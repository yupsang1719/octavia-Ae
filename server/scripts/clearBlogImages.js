import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import BlogPost from '../models/BlogPost.js'

async function main() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const result = await BlogPost.updateMany(
    { featuredImg: /unsplash\.com/ },
    { $unset: { featuredImg: '' } },
  )

  console.log(`Cleared Unsplash featuredImg from ${result.modifiedCount} posts`)
  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
