import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') })

import mongoose from 'mongoose'
import { marked } from 'marked'
import BlogPost from '../models/BlogPost.js'

async function main() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const posts = await BlogPost.find({})
  let converted = 0

  for (const post of posts) {
    // Only convert if body looks like Markdown (not already HTML)
    if (post.body && !post.body.trimStart().startsWith('<')) {
      const html = await marked.parse(post.body)
      post.body = html
      await post.save()
      console.log(`  ✓  ${post.slug}`)
      converted++
    } else {
      console.log(`  –  ${post.slug} (already HTML or empty)`)
    }
  }

  console.log(`\nDone — ${converted} posts converted to HTML`)
  await mongoose.disconnect()
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
