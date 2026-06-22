import { useState, useEffect } from 'react'
import axios from 'axios'
import { Star, Eye, EyeOff, Trash2, Plus, X } from 'lucide-react'

const EMPTY = { author: '', location: '', treatment: '', rating: 5, text: '', source: 'google' }

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star size={20} className={n <= value ? 'fill-brand-gold text-brand-gold' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  )
}

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={12} className={n <= rating ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'} />
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => { fetchReviews() }, [])

  async function fetchReviews() {
    try {
      const { data } = await axios.get('/api/reviews/all')
      setReviews(data)
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.post('/api/reviews', form)
      setReviews(prev => [data, ...prev])
      setForm(EMPTY)
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublished(review) {
    try {
      const { data } = await axios.patch(`/api/reviews/${review._id}`, { published: !review.published })
      setReviews(prev => prev.map(r => r._id === review._id ? data : r))
    } catch {
      setError('Failed to update')
    }
  }

  async function handleDelete(review) {
    if (!confirm(`Delete review by ${review.author}?`)) return
    try {
      await axios.delete(`/api/reviews/${review._id}`)
      setReviews(prev => prev.filter(r => r._id !== review._id))
    } catch {
      setError('Failed to delete')
    }
  }

  const published   = reviews.filter(r => r.published).length
  const unpublished = reviews.filter(r => !r.published).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark font-medium">Reviews</h1>
          <p className="font-sans text-sm text-brand-muted mt-0.5">
            {published} published · {unpublished} hidden
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white font-sans text-sm font-medium rounded-lg hover:bg-brand-green/90 transition-colors"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Cancel' : 'Add Review'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-4">
          <p className="font-sans text-xs font-semibold text-brand-dark uppercase tracking-wide">New Review</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs text-brand-muted mb-1.5">Patient name <span className="text-red-500">*</span></label>
              <input required type="text" placeholder="Sarah M." value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block font-sans text-xs text-brand-muted mb-1.5">Location</label>
              <input type="text" placeholder="Godalming, Surrey" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs text-brand-muted mb-1.5">Treatment</label>
              <input type="text" placeholder="Dental Implants" value={form.treatment}
                onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block font-sans text-xs text-brand-muted mb-1.5">Source</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} className="input">
                <option value="google">Google</option>
                <option value="website">Website</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-sans text-xs text-brand-muted mb-1.5">Rating</label>
            <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          </div>
          <div>
            <label className="block font-sans text-xs text-brand-muted mb-1.5">Review text <span className="text-brand-subtle">(optional)</span></label>
            <textarea rows={4} placeholder="Leave blank if the patient only left a star rating…"
              value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              className="input resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-brand-green text-white font-sans text-sm font-medium rounded-lg hover:bg-brand-green/90 disabled:opacity-60 transition-colors">
              {saving ? 'Saving…' : 'Save as hidden'}
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-brand-gold text-white font-sans text-sm font-medium rounded-lg hover:bg-brand-gold/90 disabled:opacity-60 transition-colors"
              onClick={() => setForm(f => ({ ...f, published: true }))}>
              Save & publish
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-brand-muted font-sans text-sm">
          No reviews yet — add your first one above.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review._id}
              className={`bg-white border rounded-xl px-5 py-4 flex gap-4 items-start transition-opacity ${!review.published ? 'opacity-60' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <StarDisplay rating={review.rating} />
                  <span className="font-sans text-xs font-semibold text-brand-dark">{review.author}</span>
                  {review.location && <span className="font-sans text-xs text-brand-muted">{review.location}</span>}
                  {review.treatment && (
                    <span className="font-sans text-[10px] px-2 py-0.5 bg-brand-green/10 text-brand-green rounded-full font-medium">
                      {review.treatment}
                    </span>
                  )}
                  <span className={`font-sans text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    review.source === 'google' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {review.source === 'google' ? 'Google' : 'Website'}
                  </span>
                </div>
                {review.text
                  ? <p className="font-sans text-sm text-brand-muted leading-relaxed line-clamp-2">{review.text}</p>
                  : <p className="font-sans text-xs text-brand-subtle italic">Rating only — no written review</p>
                }
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => togglePublished(review)}
                  title={review.published ? 'Hide' : 'Publish'}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-brand-muted">
                  {review.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleDelete(review)}
                  className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-brand-muted">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
