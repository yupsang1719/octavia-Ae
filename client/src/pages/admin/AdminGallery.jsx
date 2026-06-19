import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Eye, EyeOff, X } from 'lucide-react'

const TREATMENTS = [
  'dental-implants', 'invisalign', 'composite-bonding', 'veneers',
  'teeth-whitening', 'six-month-smile', 'air-flow-hygiene', 'botox-anti-wrinkle', 'general',
]

const BLANK_ITEM = {
  title: '', treatment: 'composite-bonding', beforeImg: '', afterImg: '',
  description: '', consentRef: '', published: false,
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK_ITEM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/admin/gallery')
      .then(({ data }) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function addItem(e) {
    e.preventDefault()
    if (!form.title || !form.consentRef) {
      setError('Title and consent reference are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { data } = await axios.post('/api/gallery', form)
      setItems(prev => [data, ...prev])
      setForm(BLANK_ITEM)
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item.')
    } finally {
      setSaving(false)
    }
  }

  function togglePublish(item) {
    axios.patch(`/api/gallery/${item._id}`, { published: !item.published })
      .then(({ data }) => setItems(prev => prev.map(i => i._id === item._id ? data : i)))
      .catch(console.error)
  }

  function deleteItem(id) {
    if (!window.confirm('Delete this gallery item?')) return
    axios.delete(`/api/gallery/${id}`)
      .then(() => setItems(prev => prev.filter(i => i._id !== id)))
      .catch(console.error)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-brand-dark">Gallery</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-sans hover:bg-brand-green/90 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={addItem}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4"
        >
          <p className="text-sm font-semibold text-brand-dark font-sans mb-1">New Gallery Item</p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} className={input} placeholder="e.g. Composite Bonding — Patient A" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Treatment *</label>
              <select value={form.treatment} onChange={e => set('treatment', e.target.value)} className={input}>
                {TREATMENTS.map(t => (
                  <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Before Image URL</label>
              <input value={form.beforeImg} onChange={e => set('beforeImg', e.target.value)} className={input} placeholder="https://…" type="url" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">After Image URL</label>
              <input value={form.afterImg} onChange={e => set('afterImg', e.target.value)} className={input} placeholder="https://…" type="url" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} className={input} rows={2} placeholder="Optional description of the case" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Consent Reference *</label>
              <input value={form.consentRef} onChange={e => set('consentRef', e.target.value)} className={input} placeholder="e.g. CONSENT-2024-001" required />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-brand-dark">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => set('published', e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-green"
                />
                Publish immediately
              </label>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-green text-white rounded-lg text-sm font-sans hover:bg-brand-green/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding…' : 'Add Item'}
            </button>
          </div>
        </form>
      )}

      {/* Gallery grid */}
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center">
          <p className="text-brand-muted font-sans text-sm">No gallery items yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Image preview */}
              <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                {item.afterImg ? (
                  <img src={item.afterImg} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : item.beforeImg ? (
                  <img src={item.beforeImg} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-xs text-brand-muted font-sans">No image</span>
                )}
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium font-sans ${
                  item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.published ? 'Live' : 'Hidden'}
                </span>
              </div>

              <div className="p-4">
                <p className="font-medium text-brand-dark text-sm font-sans leading-snug">{item.title}</p>
                <p className="text-xs text-brand-muted font-sans mt-0.5 capitalize">{item.treatment?.replace(/-/g, ' ')}</p>
                {item.consentRef && (
                  <p className="text-xs text-brand-subtle font-sans mt-1">Ref: {item.consentRef}</p>
                )}

                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => togglePublish(item)}
                    title={item.published ? 'Hide' : 'Publish'}
                    className="p-1.5 rounded hover:bg-gray-100 text-brand-muted hover:text-brand-dark transition-colors"
                  >
                    {item.published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    title="Delete"
                    className="p-1.5 rounded hover:bg-red-50 text-brand-muted hover:text-red-600 transition-colors ml-auto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
