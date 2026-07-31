import { Fragment, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Plus, ChevronDown, ChevronUp, Upload, X } from 'lucide-react'
import { PRACTICES } from '../../data/stockConstants'

const TYPE_LABELS = { popup: 'Popup', banner: 'Banner' }
const PRACTICE_LABELS = Object.fromEntries(PRACTICES.map(p => [p.slug, p.label]))

function practiceSummary(practices) {
  if (!practices?.length) return '—'
  if (practices.length === PRACTICES.length) return 'All practices'
  return practices.map(p => PRACTICE_LABELS[p]).join(', ')
}

function toDateInput(value) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

function statusOf(notice) {
  const now = new Date()
  if (!notice.active) return { label: 'Inactive', className: 'bg-gray-100 text-gray-500' }
  if (notice.startDate && new Date(notice.startDate) > now) return { label: 'Scheduled', className: 'bg-amber-100 text-amber-700' }
  if (notice.endDate && new Date(notice.endDate) < now) return { label: 'Expired', className: 'bg-gray-100 text-gray-500' }
  return { label: 'Live', className: 'bg-green-100 text-green-700' }
}

export default function AdminNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { load() }, [])

  function load() {
    setLoading(true)
    axios.get('/api/notices').then(({ data }) => setNotices(Array.isArray(data) ? data : [])).catch(console.error).finally(() => setLoading(false))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif text-2xl text-brand-dark">Notices</h1>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 bg-brand-green text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-green/90"
        >
          <Plus size={14} /> New notice
        </button>
      </div>

      <p className="text-sm text-brand-muted font-sans mb-4">
        Popups appear as a dismissible overlay; banners show as a slim bar under the navbar. Multiple notices can be live at once.
      </p>

      {adding && (
        <NoticeForm onSaved={() => { setAdding(false); load() }} onCancel={() => setAdding(false)} />
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-3 py-3 font-medium">Type</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Practice</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notices.map(notice => {
                const status = statusOf(notice)
                return (
                  <Fragment key={notice._id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpanded(e => e === notice._id ? null : notice._id)}
                    >
                      <td className="px-4 py-3 font-sans font-medium text-brand-dark">{notice.title}</td>
                      <td className="px-3 py-3 font-sans text-brand-muted">{TYPE_LABELS[notice.type]}</td>
                      <td className="px-3 py-3 font-sans text-brand-muted hidden md:table-cell">{practiceSummary(notice.practices)}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-sans px-2 py-0.5 rounded-full ${status.className}`}>{status.label}</span>
                      </td>
                      <td className="px-3 py-3 text-brand-muted">
                        {expanded === notice._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </td>
                    </tr>
                    {expanded === notice._id && (
                      <tr>
                        <td colSpan={5} className="px-5 py-5 bg-gray-50 border-t border-gray-100">
                          <NoticeForm
                            notice={notice}
                            onSaved={() => { setExpanded(null); load() }}
                            onCancel={() => setExpanded(null)}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {notices.length === 0 && !loading && (
                <tr><td colSpan={5} className="text-center text-brand-muted py-10 font-sans">No notices yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function NoticeForm({ notice, onSaved, onCancel }) {
  const empty = {
    title: '', message: '', type: 'banner', practices: PRACTICES.map(p => p.slug),
    image: '', linkText: '', linkUrl: '', startDate: '', endDate: '',
  }
  const [form, setForm] = useState(notice ? {
    title: notice.title, message: notice.message, type: notice.type, practices: notice.practices || [],
    image: notice.image || '', linkText: notice.linkText || '', linkUrl: notice.linkUrl || '',
    startDate: toDateInput(notice.startDate), endDate: toDateInput(notice.endDate),
  } : empty)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(notice?.image || '')
  const imgInputRef = useRef()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function togglePractice(slug) {
    setForm(prev => ({
      ...prev,
      practices: prev.practices.includes(slug)
        ? prev.practices.filter(p => p !== slug)
        : [...prev.practices, slug],
    }))
  }

  function pickImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImgFile(null)
    setImgPreview('')
    set('image', '')
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      let image = form.image

      if (imgFile) {
        const fd = new FormData()
        fd.append('image', imgFile)
        const { data } = await axios.post('/api/upload/notices', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        image = data.url
      }

      const payload = { ...form, image }
      if (notice) {
        await axios.patch(`/api/notices/${notice._id}`, payload)
      } else {
        await axios.post('/api/notices', payload)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive() {
    setSaving(true)
    try {
      await axios.patch(`/api/notices/${notice._id}`, { active: !notice.active })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update')
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-4" onClick={e => e.stopPropagation()}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" required>
          <input value={form.title} onChange={e => set('title', e.target.value)} className="input" />
        </Field>
        <Field label="Type">
          <select value={form.type} onChange={e => set('type', e.target.value)} className="input">
            <option value="banner">Banner (slim bar under navbar)</option>
            <option value="popup">Popup (dismissible overlay)</option>
          </select>
        </Field>
        <Field label="Practices" required>
          <div className="flex flex-col gap-2 pt-1">
            {PRACTICES.map(p => (
              <label key={p.slug} className="flex items-center gap-2 text-sm text-brand-dark font-sans cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.practices.includes(p.slug)}
                  onChange={() => togglePractice(p.slug)}
                  className="rounded"
                />
                {p.label}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Link URL (optional)">
          <input value={form.linkUrl} onChange={e => set('linkUrl', e.target.value)} className="input" placeholder="/treatments/teeth-whitening" />
        </Field>
        <Field label="Link text (optional)">
          <input value={form.linkText} onChange={e => set('linkText', e.target.value)} className="input" placeholder="Find out more" />
        </Field>
        <Field label="Start date (optional)">
          <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="input" />
        </Field>
        <Field label="End date (optional)">
          <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Message" required>
        <textarea rows={3} value={form.message} onChange={e => set('message', e.target.value)} className="input resize-none" />
      </Field>

      <Field label="Image (optional, popup only)">
        {imgPreview ? (
          <div className="relative inline-block">
            <img src={imgPreview} alt="" className="h-24 rounded-lg border border-gray-200 object-cover" />
            <button onClick={removeImage} className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50">
              <X size={12} />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-3 text-sm text-brand-muted cursor-pointer hover:border-gray-400 w-fit">
            <Upload size={14} />
            <span className="text-xs font-sans">Click to upload image</span>
            <input ref={imgInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={pickImage} className="hidden" />
          </label>
        )}
      </Field>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={save} disabled={saving || !form.title.trim() || !form.message.trim() || form.practices.length === 0} className="bg-brand-green text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-brand-green/90 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-gray-400">
            Cancel
          </button>
        </div>
        {notice && (
          <button onClick={toggleActive} disabled={saving} className="text-sm text-red-500 hover:text-red-700">
            {notice.active ? 'Deactivate' : 'Reactivate'}
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-sans text-brand-muted mb-1.5">{label}{required && ' *'}</span>
      {children}
    </label>
  )
}
