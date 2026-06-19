import { Router } from 'express'
import { getPosts, getPostBySlug, getPostsByCategory, createPost, updatePost, deletePost } from '../controllers/blogController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/',               getPosts)
router.get('/category/:cat',  getPostsByCategory)
router.get('/:slug',          getPostBySlug)
router.post('/',              requireAuth, createPost)
router.put('/:id',            requireAuth, updatePost)
router.delete('/:id',         requireAuth, deletePost)

export default router
