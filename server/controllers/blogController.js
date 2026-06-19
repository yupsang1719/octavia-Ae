import BlogPost from '../models/BlogPost.js'

export async function getPosts(req, res) {
  try {
    const { page = 1, limit = 9 } = req.query
    const [posts, total] = await Promise.all([
      BlogPost.find({ published: true })
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-body'),
      BlogPost.countDocuments({ published: true }),
    ])
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

export async function getPostBySlug(req, res) {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
}

export async function getPostsByCategory(req, res) {
  try {
    const posts = await BlogPost.find({ category: req.params.cat, published: true })
      .sort({ publishedAt: -1 })
      .select('-body')
    res.json(posts)
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

export async function createPost(req, res) {
  try {
    const post = await BlogPost.create(req.body)
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function updatePost(req, res) {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function deletePost(req, res) {
  try {
    await BlogPost.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete post' })
  }
}
