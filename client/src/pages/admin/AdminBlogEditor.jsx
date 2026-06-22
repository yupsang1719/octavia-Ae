import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Save, Globe, Upload, X } from 'lucide-react'
import RichTextEditor from '../../components/ui/RichTextEditor'

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

const CATEGORIES = ['dental', 'aesthetics', 'local', 'news']

const BLANK = {
  title: '', slug: '', excerpt: '', body: '', category: 'dental',
  author: 'Octavia Dental', featuredImg: '', seoTitle: '', seoDesc: '',
  tags: '', location: '', published: false,
}

export default function AdminBlogEditor() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState(BLANK)
  const [slugEdited, setSlugEdited] = useState(false)
  const [loading, setLoading] = useState(isEdit && !state?.post)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState('')
  const imgInputRef = useRef()

  const populateForm = useCallback((post) => {
    setForm({
      title:       post.title       || '',
      slug:        post.slug        || '',
      excerpt:     post.excerpt     || '',
      body:        post.body        || '',
      category:    post.category    || 'dental',
      author:      post.author      || 'Octavia Dental',
      featuredImg: post.featuredImg || '',
      seoTitle:    post.seoTitle    || '',
      seoDesc:     post.seoDesc     || '',
      tags:        (post.tags || []).join(', '),
      location:    post.location    || '',
      published:   post.published   || false,
    })
    setImgPreview(post.featuredImg || '')
    setImgFile(null)
    setSlugEdited(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isEdit) return
    axios.get(`/api/admin/posts/${id}`)
      .then(({ data }) => populateForm(data))
      .catch(() => setError('Failed to load post.'))
      .finally(() => setLoading(false))
  }, [id, isEdit, populateForm])

  function set(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !slugEdited) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  async function save(publish) {
    setError('')
    setSaving(true)
    try {
      let featuredImg = form.featuredImg

      if (imgFile) {
        const fd = new FormData()
        fd.append('image', imgFile)
        const { data } = await axios.post('/api/upload/blog', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        featuredImg = data.url
      }

      const payload = {
        ...form,
        featuredImg,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        published: publish ?? form.published,
        ...(publish && !form.published ? { publishedAt: new Date() } : {}),
      }
      if (isEdit) {
        await axios.put(`/api/blog/${id}`, payload)
      } else {
        await axios.post('/api/blog', payload)
      }
      navigate('/admin/blog')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/blog')}
          className="p-1.5 rounded hover:bg-gray-200 text-brand-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-serif text-2xl text-brand-dark">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-sans">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <Field label="Title *">
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className={input}
            placeholder="Post title"
          />
        </Field>

        {/* Slug */}
        <Field label="Slug *" hint="URL-safe identifier, auto-generated from title">
          <input
            value={form.slug}
            onChange={e => { setSlugEdited(true); set('slug', slugify(e.target.value)) }}
            className={input}
            placeholder="post-slug"
          />
        </Field>

        {/* Excerpt */}
        <Field label="Excerpt *" hint="Max 160 characters — used as meta description">
          <textarea
            value={form.excerpt}
            onChange={e => set('excerpt', e.target.value)}
            rows={2}
            maxLength={160}
            className={input}
            placeholder="Brief summary of the post…"
          />
          <p className="text-xs text-brand-muted mt-1 text-right font-sans">{form.excerpt.length}/160</p>
        </Field>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1 font-sans">Body *</label>
          <RichTextEditor
            value={form.body}
            onChange={v => set('body', v)}
            placeholder="Write your post…"
          />
        </div>

        {/* Category + Author */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category">
            <select value={form.category} onChange={e => set('category', e.target.value)} className={input}>
              {CATEGORIES.map(c => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Author">
            <input
              value={form.author}
              onChange={e => set('author', e.target.value)}
              className={input}
              placeholder="Author name"
            />
          </Field>
        </div>

        {/* Featured image */}
        <Field label="Featured Image">
          <div className="space-y-2">
            {imgPreview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img src={imgPreview} alt="Featured" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImgFile(null); setImgPreview(''); set('featuredImg', '') }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => imgInputRef.current.click()}
                className="flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 cursor-pointer hover:border-brand-green transition-colors text-brand-muted"
              >
                <Upload size={20} />
                <span className="text-xs font-sans">Click to upload featured image</span>
                <span className="text-xs font-sans text-brand-subtle">JPEG, PNG, WebP — max 5 MB</span>
              </div>
            )}
            <input
              ref={imgInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={e => {
                const file = e.target.files[0]
                if (!file) return
                setImgFile(file)
                setImgPreview(URL.createObjectURL(file))
              }}
            />
            {imgPreview && !imgFile && (
              <button
                type="button"
                onClick={() => imgInputRef.current.click()}
                className="text-xs font-sans text-brand-green hover:underline"
              >
                Replace image
              </button>
            )}
          </div>
        </Field>

        {/* Tags + Location */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tags" hint="Comma-separated">
            <input
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              className={input}
              placeholder="implants, cosmetic, surrey"
            />
          </Field>
          <Field label="Location">
            <input
              value={form.location}
              onChange={e => set('location', e.target.value)}
              className={input}
              placeholder="Godalming, Surrey"
            />
          </Field>
        </div>

        {/* SEO overrides */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
          <p className="text-xs font-medium text-brand-muted uppercase tracking-widest font-sans">SEO Overrides (optional)</p>
          <Field label="SEO Title" hint="Leave blank to use post title">
            <input value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} className={input} placeholder="Custom SEO title" />
          </Field>
          <Field label="SEO Description" hint="Leave blank to use excerpt">
            <input value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} className={input} placeholder="Custom meta description" />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => save(false)}
            disabled={saving || !form.title || !form.slug || !form.excerpt || !form.body}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-sans text-brand-dark hover:border-gray-400 transition-colors disabled:opacity-40"
          >
            <Save size={15} />
            Save draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving || !form.title || !form.slug || !form.excerpt || !form.body}
            className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-sans hover:bg-brand-green/90 transition-colors disabled:opacity-40"
          >
            <Globe size={15} />
            {form.published ? 'Update & keep published' : 'Publish'}
          </button>
          <button
            onClick={() => navigate('/admin/blog')}
            className="ml-auto text-sm text-brand-muted hover:text-brand-dark font-sans transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark mb-1 font-sans">
        {label}
        {hint && <span className="font-normal text-brand-muted ml-2 text-xs">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-shadow'
