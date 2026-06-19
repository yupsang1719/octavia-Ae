import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/admin/posts')
      .then(({ data }) => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function togglePublish(post) {
    const update = { published: !post.published, publishedAt: !post.published ? new Date() : post.publishedAt }
    axios.put(`/api/blog/${post._id}`, update)
      .then(({ data }) => setPosts(prev => prev.map(p => p._id === post._id ? { ...p, ...data } : p)))
      .catch(console.error)
  }

  function deletePost(id) {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setDeletingId(id)
    axios.delete(`/api/blog/${id}`)
      .then(() => setPosts(prev => prev.filter(p => p._id !== id)))
      .catch(console.error)
      .finally(() => setDeletingId(null))
  }

  function editPost(post) {
    navigate(`/admin/blog/edit/${post._id}`, { state: { post } })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-brand-dark">Blog Posts</h1>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-sans hover:bg-brand-green/90 transition-colors"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <Spinner />
        ) : posts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-brand-muted font-sans text-sm mb-4">No blog posts yet.</p>
            <button
              onClick={() => navigate('/admin/blog/new')}
              className="text-sm text-brand-green hover:underline font-sans"
            >
              Create your first post →
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-brand-dark font-sans leading-snug">{post.title}</p>
                    <p className="text-xs text-brand-muted font-sans mt-0.5">{post.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-brand-muted hidden sm:table-cell font-sans capitalize">
                    {post.category || '—'}
                  </td>
                  <td className="px-5 py-3 text-brand-muted hidden md:table-cell font-sans">
                    {new Date(post.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sans ${
                      post.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => togglePublish(post)}
                        title={post.published ? 'Unpublish' : 'Publish'}
                        className="p-1.5 rounded hover:bg-gray-100 text-brand-muted hover:text-brand-dark transition-colors"
                      >
                        {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => editPost(post)}
                        title="Edit"
                        className="p-1.5 rounded hover:bg-gray-100 text-brand-muted hover:text-brand-dark transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deletePost(post._id)}
                        disabled={deletingId === post._id}
                        title="Delete"
                        className="p-1.5 rounded hover:bg-red-50 text-brand-muted hover:text-red-600 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
