import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Eye, EyeOff, X, Upload, ArrowUp, ArrowDown, Film, Loader2, AlertCircle } from 'lucide-react'
import { usePractice } from '../../contexts/PracticeContext'

const MAX_MB = 200
const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent'
const label = 'block text-xs font-medium text-brand-dark mb-1 font-sans'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function fmtDuration(s) {
  if (!s) return ''
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function AdminPatientStories() {
  const { slug } = usePractice()
  const [items, setItems]           = useState([])
  const [treatments, setTreatments] = useState([])
  const [practices, setPractices]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [error, setError]           = useState('')
  const [progress, setProgress]     = useState(null)   // upload %, null when idle

  const blank = { name: '', treatment: '', quote: '', consentRef: '', practices: [slug], published: false }
  const [form, setForm]         = useState(blank)
  const [video, setVideo]       = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [poster, setPoster]     = useState(null)
  const videoRef  = useRef()
  const posterRef = useRef()

  useEffect(() => {
    Promise.all([
      axios.get('/api/patient-stories/admin/all').then(r => setItems(r.data)),
      axios.get('/api/treatments/admin/all').then(r => setTreatments(r.data)).catch(() => {}),
      axios.get('/api/practice/all').then(r => setPractices(r.data)).catch(() => {}),
    ]).catch(console.error).finally(() => setLoading(false))
  }, [])

  // Poll while any video is still being processed on the server
  const processing = items.some(i => i.status === 'processing')
  useEffect(() => {
    if (!processing) return
    const t = setInterval(() => {
      axios.get('/api/patient-stories/admin/all').then(r => setItems(r.data)).catch(() => {})
    }, 5000)
    return () => clearInterval(t)
  }, [processing])

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  function togglePractice(s) {
    setForm(prev => ({
      ...prev,
      practices: prev.practices.includes(s) ? prev.practices.filter(p => p !== s) : [...prev.practices, s],
    }))
  }

  function pickVideo(file) {
    setError('')
    if (file && file.size > MAX_MB * 1024 * 1024) {
      setError(`That file is ${fmtMB(file.size)} — the limit is ${MAX_MB} MB.`)
      return
    }
    if (videoPreview) URL.revokeObjectURL(videoPreview)
    setVideo(file)
    setVideoPreview(file ? URL.createObjectURL(file) : '')
  }

  function resetForm() {
    if (videoPreview) URL.revokeObjectURL(videoPreview)
    setForm(blank); setVideo(null); setVideoPreview(''); setPoster(null)
    setError(''); setProgress(null); setShowForm(false)
  }

  async function submit(e) {
    e.preventDefault()
    if (!video) return setError('Please choose a video.')
    if (!form.name || !form.consentRef) return setError('Patient name and consent reference are required.')
    if (!form.practices.length) return setError('Choose at least one website.')

    setError('')
    setProgress(0)
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('treatment', form.treatment)
    fd.append('quote', form.quote)
    fd.append('consentRef', form.consentRef)
    fd.append('practices', JSON.stringify(form.practices))
    fd.append('published', String(form.published))
    if (poster) fd.append('poster', poster)
    fd.append('video', video)  // last, so text fields arrive first

    try {
      const { data } = await axios.post('/api/patient-stories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 0,
        onUploadProgress: ev => ev.total && setProgress(Math.round((ev.loaded / ev.total) * 100)),
      })
      setItems(prev => [data, ...prev])
      resetForm()
    } catch (err) {
      setProgress(null)
      setError(err.response?.status === 413
        ? `The file is too large for the server (limit ${MAX_MB} MB).`
        : err.response?.data?.error || 'Upload failed. Please try again.')
    }
  }

  function patch(item, body) {
    return axios.patch(`/api/patient-stories/${item._id}`, body)
      .then(({ data }) => setItems(prev => prev.map(i => i._id === item._id ? data : i)))
      .catch(console.error)
  }

  function remove(item) {
    if (!window.confirm(`Delete ${item.name}'s video? This can't be undone.`)) return
    axios.delete(`/api/patient-stories/${item._id}`)
      .then(() => setItems(prev => prev.filter(i => i._id !== item._id)))
      .catch(console.error)
  }

  // Swap order with the neighbour, then normalise so orders are 0..n-1
  async function move(index, dir) {
    const next = [...items]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    setItems(next)
    await Promise.all(next.map((it, i) => it.order === i ? null : axios.patch(`/api/patient-stories/${it._id}`, { order: i })))
    axios.get('/api/patient-stories/admin/all').then(r => setItems(r.data)).catch(() => {})
  }

  const treatmentName = s => treatments.find(t => t.slug === s)?.name || s
  const uploading = progress !== null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-2xl text-brand-dark">Patient Stories</h1>
        <button
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          disabled={uploading}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-sans hover:bg-brand-green/90 transition-colors disabled:opacity-50"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Video'}
        </button>
      </div>
      <p className="text-sm text-brand-muted font-sans mb-6">
        Video testimonials shown on the home page and on the matching treatment page. The top video is featured.
      </p>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-5">
          <p className="text-sm font-semibold text-brand-dark font-sans">New Patient Story</p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="grid sm:grid-cols-[220px_1fr] gap-5">
            {/* Video picker */}
            <div>
              <label className={label}>Video *</label>
              <div
                onClick={() => !uploading && videoRef.current.click()}
                className="relative cursor-pointer border-2 border-dashed border-gray-200 rounded-lg overflow-hidden hover:border-brand-green transition-colors aspect-square bg-gray-50"
              >
                {videoPreview ? (
                  <video src={videoPreview} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-brand-muted px-4 text-center">
                    <Upload size={20} />
                    <span className="text-xs font-sans">Click to choose video</span>
                    <span className="text-[11px] font-sans text-brand-subtle">MP4 / MOV, up to {MAX_MB} MB</span>
                  </div>
                )}
              </div>
              <input ref={videoRef} type="file" accept="video/mp4,video/quicktime,video/webm,.m4v" className="hidden"
                onChange={e => pickVideo(e.target.files[0] || null)} />
              {video && <p className="text-xs text-brand-muted font-sans mt-1 truncate">{video.name} · {fmtMB(video.size)}</p>}

              <button type="button" onClick={() => posterRef.current.click()} disabled={uploading}
                className="mt-3 text-xs font-sans text-brand-green hover:underline">
                {poster ? `Cover: ${poster.name}` : '+ Custom cover image (optional)'}
              </button>
              <input ref={posterRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={e => setPoster(e.target.files[0] || null)} />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Patient first name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} className={input} placeholder="e.g. Sarah" required />
                </div>
                <div>
                  <label className={label}>Treatment</label>
                  <select value={form.treatment} onChange={e => set('treatment', e.target.value)} className={input}>
                    <option value="">— None (home page only) —</option>
                    {treatments.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={label}>Pull-quote</label>
                <textarea value={form.quote} onChange={e => set('quote', e.target.value)} className={input} rows={2} maxLength={220}
                  placeholder="A short line from the video, in the patient's own words" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Consent reference *</label>
                  <input value={form.consentRef} onChange={e => set('consentRef', e.target.value)} className={input}
                    placeholder="e.g. CONSENT-2026-014" required />
                </div>
                {practices.length > 1 && (
                  <div>
                    <label className={label}>Show on websites</label>
                    <div className="space-y-1.5 pt-1">
                      {practices.map(p => (
                        <label key={p.slug} className="flex items-center gap-2 text-sm font-sans text-brand-dark cursor-pointer">
                          <input type="checkbox" checked={form.practices.includes(p.slug)} onChange={() => togglePractice(p.slug)}
                            className="w-4 h-4 rounded accent-brand-green" />
                          {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-brand-dark">
                <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-green" />
                Publish as soon as processing finishes
              </label>
            </div>
          </div>

          {uploading ? (
            <div>
              <div className="flex justify-between text-xs font-sans text-brand-muted mb-1">
                <span>{progress < 100 ? 'Uploading…' : 'Finishing upload…'}</span><span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-green transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-brand-subtle font-sans mt-2">Please keep this page open until the upload completes.</p>
            </div>
          ) : (
            <button type="submit"
              className="px-5 py-2 bg-brand-green text-white rounded-lg text-sm font-sans hover:bg-brand-green/90 transition-colors">
              Upload Video
            </button>
          )}
        </form>
      )}

      {loading ? <Spinner /> : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center">
          <Film className="mx-auto text-brand-subtle mb-2" size={24} />
          <p className="text-brand-muted font-sans text-sm">No patient stories yet. Add your first video above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {item.status === 'ready' ? (
                  <video src={item.videoUrl} poster={item.posterUrl} controls preload="none" playsInline className="w-full h-full object-cover" />
                ) : item.status === 'processing' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-muted">
                    <Loader2 size={22} className="animate-spin" />
                    <span className="text-xs font-sans">Optimising video…</span>
                    <span className="text-[11px] font-sans text-brand-subtle">Usually 1–3 minutes</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-red-600 px-6 text-center">
                    <AlertCircle size={22} />
                    <span className="text-xs font-sans">{item.error || 'Processing failed'}</span>
                  </div>
                )}
                {i === 0 && item.status === 'ready' && (
                  <span className="absolute top-2 left-2 text-[10px] bg-brand-gold text-white px-2 py-0.5 rounded font-sans font-semibold uppercase tracking-wider">Featured</span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-brand-dark text-sm font-sans leading-snug">{item.name}</p>
                    <p className="text-xs text-brand-muted font-sans mt-0.5">
                      {item.treatment ? treatmentName(item.treatment) : 'No treatment'}
                      {item.duration ? ` · ${fmtDuration(item.duration)}` : ''}
                      {item.sizeBytes ? ` · ${fmtMB(item.sizeBytes)}` : ''}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium font-sans ${
                    item.published && item.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.published ? (item.status === 'ready' ? 'Live' : 'Will publish') : 'Hidden'}
                  </span>
                </div>
                {item.quote && <p className="text-xs text-brand-dark/70 font-sans mt-2 italic line-clamp-2">&ldquo;{item.quote}&rdquo;</p>}
                <p className="text-xs text-brand-subtle font-sans mt-1">Ref: {item.consentRef}</p>

                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => patch(item, { published: !item.published })}
                    title={item.published ? 'Hide from site' : 'Publish to site'}
                    className="p-1.5 rounded hover:bg-gray-100 text-brand-muted hover:text-brand-dark transition-colors">
                    {item.published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up"
                    className="p-1.5 rounded hover:bg-gray-100 text-brand-muted hover:text-brand-dark transition-colors disabled:opacity-30">
                    <ArrowUp size={15} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down"
                    className="p-1.5 rounded hover:bg-gray-100 text-brand-muted hover:text-brand-dark transition-colors disabled:opacity-30">
                    <ArrowDown size={15} />
                  </button>
                  <button onClick={() => remove(item)} title="Delete"
                    className="p-1.5 rounded hover:bg-red-50 text-brand-muted hover:text-red-600 transition-colors ml-auto">
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
