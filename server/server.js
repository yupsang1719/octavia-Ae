import './env.js'
import app from './app.js'
import { connectDB } from './config/db.js'
import { configureCloudinary } from './config/cloudinary.js'
import { failStaleJobs } from './services/videoProcessor.js'

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  configureCloudinary()
  await failStaleJobs()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
