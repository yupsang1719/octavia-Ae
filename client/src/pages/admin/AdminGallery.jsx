import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react'

const TREATMENTS = [
  { value: 'dental-implants',   label: 'Dental Implants' },
  { value: 'invisalign',        label: 'Invisalign' },
  { value: 'composite-bonding', label: 'Composite Bonding' },
  { value: 'veneers',           label: 'Veneers' },
  { value: 'teeth-whitening',   label: 'Teeth Whitening' },
  { value: 'six-month-smile',   label: 'Six Month Smile' },
  { value: 'air-flow-hygiene',  label: 'Air Flow Hygiene' },
  { value: 'botox-anti-wrinkle','label': 'Botox / Anti-Wrinkle' },
  { value: 'general',           label: 'General' },
]

const BLANK = {
  title: '', treatment: 'composite-bonding',
  description: '', consentRef: '', published: false,
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ImagePicker({ label, file, preview, onPick, required }) {
  const ref = useRef()
  return (
    <div>
      <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">
        {label}{required && ' *'}
      </label>
      <div
        onClick={() => ref.current.click()}
        className="relative cursor-pointer border-2 border-dashed border-gray-200 rounded-lg overflow-hidden hover:border-brand-green transition-colors"
        style={{ aspectRatio: '4/3' }}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-brand-muted">
            <Upload size={20} />
            <span className="text-xs font-sans">Click to upload</span>
          </div>
        )}
        {preview && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 hover:opacity-100 text-white text-xs font-sans font-medium">Change</span>
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={e => onPick(e.target.files[0] || null)}
      />
      {file && (
        <p className="text-xs text-brand-muted font-sans mt-1 truncate">{file.name}</p>
      )}
    </div>
  )
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent'

export default function AdminGallery() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState(BLANK)
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile,  setAfterFile]  = useState(null)
  const [beforePreview, setBeforePreview] = useState('')
  const [afterPreview,  setAfterPreview]  = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    axios.get('/api/admin/gallery')
      .then(({ data }) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function pickBefore(file) {
    setBeforeFile(file)
    setBeforePreview(file ? URL.createObjectURL(file) : '')
  }

  function pickAfter(file) {
    setAfterFile(file)
    setAfterPreview(file ? URL.createObjectURL(file) : '')
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setForm(BLANK)
    setBeforeFile(null)
    setAfterFile(null)
    setBeforePreview('')
    setAfterPreview('')
    setError('')
    setShowForm(false)
  }

  async function addItem(e) {
    e.preventDefault()
    if (!form.title || !form.consentRef) {
      setError('Title and consent reference are required.')
      return
    }
    if (!beforeFile && !afterFile) {
      setError('Upload at least one image (before or after).')
      return
    }

    setSaving(true)
    setError('')

    try {
      // 1. Upload images
      const fd = new FormData()
      if (beforeFile) fd.append('beforeImg', beforeFile)
      if (afterFile)  fd.append('afterImg',  afterFile)

      const { data: urls } = await axios.post('/api/upload/gallery', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // 2. Save gallery item with returned URLs
      const { data: item } = await axios.post('/api/gallery', {
        ...form,
        beforeImg: urls.beforeImg || '',
        afterImg:  urls.afterImg  || '',
      })

      setItems(prev => [item, ...prev])
      resetForm()
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
          onClick={() => showForm ? resetForm() : setShowForm(true)}
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
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-5"
        >
          <p className="text-sm font-semibold text-brand-dark font-sans">New Gallery Item</p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Image uploads */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ImagePicker label="Before Image" file={beforeFile} preview={beforePreview} onPick={pickBefore} />
            <ImagePicker label="After Image"  file={afterFile}  preview={afterPreview}  onPick={pickAfter} />
          </div>
          <p className="text-xs text-brand-muted font-sans -mt-2">Upload at least one image. JPEG, PNG, WebP or AVIF, max 8 MB each.</p>

          {/* Title + Treatment */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Title *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className={input}
                placeholder="e.g. Composite Bonding — Patient A"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Treatment *</label>
              <select value={form.treatment} onChange={e => set('treatment', e.target.value)} className={input}>
                {TREATMENTS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className={input}
              rows={2}
              placeholder="Optional case notes (not shown publicly)"
            />
          </div>

          {/* Consent ref + publish */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-dark mb-1 font-sans">Consent Reference *</label>
              <input
                value={form.consentRef}
                onChange={e => set('consentRef', e.target.value)}
                className={input}
                placeholder="e.g. CONSENT-2024-001"
                required
              />
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

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-brand-green text-white rounded-lg text-sm font-sans hover:bg-brand-green/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Uploading…' : 'Add Item'}
          </button>
        </form>
      )}

      {/* Gallery grid */}
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center">
          <p className="text-brand-muted font-sans text-sm">No gallery items yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Before / After preview */}
              <div className="grid grid-cols-2 gap-px bg-gray-100">
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {item.beforeImg
                    ? <img src={item.beforeImg} alt="Before" className="w-full h-full object-cover" loading="lazy" />
                    : <span className="absolute inset-0 flex items-center justify-center text-xs text-brand-muted font-sans">No before</span>
                  }
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded font-sans">Before</span>
                </div>
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {item.afterImg
                    ? <img src={item.afterImg} alt="After" className="w-full h-full object-cover" loading="lazy" />
                    : <span className="absolute inset-0 flex items-center justify-center text-xs text-brand-muted font-sans">No after</span>
                  }
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded font-sans">After</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-brand-dark text-sm font-sans leading-snug">{item.title}</p>
                    <p className="text-xs text-brand-muted font-sans mt-0.5">
                      {TREATMENTS.find(t => t.value === item.treatment)?.label || item.treatment}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium font-sans ${
                    item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.published ? 'Live' : 'Hidden'}
                  </span>
                </div>
                {item.consentRef && (
                  <p className="text-xs text-brand-subtle font-sans mt-1">Ref: {item.consentRef}</p>
                )}

                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => togglePublish(item)}
                    title={item.published ? 'Hide from site' : 'Publish to site'}
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
