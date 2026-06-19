import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import Enquiry from '../models/Enquiry.js'
import BlogPost from '../models/BlogPost.js'
import GalleryItem from '../models/GalleryItem.js'
import TeamMember from '../models/TeamMember.js'

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    res.json({ token })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
}

export async function getAllPosts(_req, res) {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 }).select('-body')
    res.json(posts)
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

export async function getPostById(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
}

export async function getAllTeam(_req, res) {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 })
    res.json(members)
  } catch {
    res.status(500).json({ error: 'Failed to fetch team' })
  }
}

export async function getAllGallery(_req, res) {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 })
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Failed to fetch gallery' })
  }
}

export async function getDashboard(_req, res) {
  try {
    const [totalEnquiries, newEnquiries, totalPosts, publishedPosts] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ published: true }),
    ])
    res.json({ totalEnquiries, newEnquiries, totalPosts, publishedPosts })
  } catch {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
}
