import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Plus, X, Save, Upload, Loader } from 'lucide-react'

const CATEGORIES = [
  { value: 'dentist', label: 'Dentist' },
  { value: 'hygienist', label: 'Dental Hygienist' },
  { value: 'therapist', label: 'Dental Therapist' },
  { value: 'nurse', label: 'Dental Nurse' },
  { value: 'trainee-nurse', label: 'Trainee Dental Nurse' },
  { value: 'practice-manager', label: 'Practice Manager' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
]

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const EMPTY = {
  name: '', slug: '', role: '', eyebrow: '', category: 'other',
  specialisms: [], gdcNumber: '', initials: '', image: '',
  bio: '', bioExtended: [], qualifications: [], treatments: [],
  bookingService: '', ctaHeading: '', ctaBody: '',
  prescriptionNotice: false, hasPage: false,
  metaTitle: '', metaDesc: '',
  published: false, order: 0,
}

export default function AdminTeamEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Array-input staging values
  const [specialism, setSpecialism] = useState('')
  const [qualification, setQualification] = useState('')
  const [bioExtLine, setBioExtLine] = useState('')
  const [treatmentLabel, setTreatmentLabel] = useState('')
  const [treatmentHref, setTreatmentHref] = useState('')

  useEffect(() => {
    if (!isNew) loadMember()
  }, [id])

  async function loadMember() {
    try {
      const { data } = await axios.get(`/api/admin/team`)
      const member = data.find(m => m._id === id)
      if (member) setForm(member)
      else setError('Member not found')
    } catch {
      setError('Failed to load member')
    } finally {
      setLoading(false)
    }
  }

  function set(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && isNew) next.slug = slugify(value)
      return next
    })
  }

  function addSpecialism() {
    if (!specialism.trim()) return
    setForm(prev => ({ ...prev, specialisms: [...prev.specialisms, specialism.trim()] }))
    setSpecialism('')
  }

  function addQualification() {
    if (!qualification.trim()) return
    setForm(prev => ({ ...prev, qualifications: [...prev.qualifications, qualification.trim()] }))
    setQualification('')
  }

  function addBioExt() {
    if (!bioExtLine.trim()) return
    setForm(prev => ({ ...prev, bioExtended: [...prev.bioExtended, bioExtLine.trim()] }))
    setBioExtLine('')
  }

  function addTreatment() {
    if (!treatmentLabel.trim() || !treatmentHref.trim()) return
    setForm(prev => ({ ...prev, treatments: [...prev.treatments, { label: treatmentLabel.trim(), href: treatmentHref.trim() }] }))
    setTreatmentLabel('')
    setTreatmentHref('')
  }

  async function save(publish = null) {
    setSaving(true)
    setError('')
    try {
      const payload = publish !== null ? { ...form, published: publish } : form
      if (isNew) {
        await axios.post('/api/team', payload)
      } else {
        await axios.put(`/api/team/${id}`, payload)
      }
      navigate('/admin/team')
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading…</div>

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/admin/team')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={14} /> Back to team
      </button>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isNew ? 'Add team member' : `Edit — ${form.name}`}
      </h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="space-y-6">

        {/* Basic info */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-medium text-gray-800 text-sm uppercase tracking-wide">Basic info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" required>
              <input value={form.name} onChange={e => set('name', e.target.value)} className="input" />
            </Field>
            <Field label="Slug (URL)">
              <input value={form.slug} onChange={e => set('slug', e.target.value)} className="input font-mono text-sm" />
            </Field>
            <Field label="Role / Job title">
              <input value={form.role} onChange={e => set('role', e.target.value)} className="input" />
            </Field>
            <Field label="Eyebrow text (above name)">
              <input value={form.eyebrow} onChange={e => set('eyebrow', e.target.value)} className="input" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Initials (for photo placeholder)">
              <input value={form.initials} onChange={e => set('initials', e.target.value)} className="input" maxLength={3} />
            </Field>
            <Field label="Photo">
              <ImageUploader value={form.image} onChange={url => set('image', url)} />
            </Field>
            <Field label="GDC number">
              <input value={form.gdcNumber} onChange={e => set('gdcNumber', e.target.value)} className="input" />
            </Field>
            <Field label="Order (lower = first)">
              <input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} className="input" />
            </Field>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.hasPage} onChange={e => set('hasPage', e.target.checked)} className="rounded" />
              Has own page (/our-team/slug)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.prescriptionNotice} onChange={e => set('prescriptionNotice', e.target.checked)} className="rounded" />
              Show prescription notice
            </label>
          </div>
        </section>

        {/* Bio */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-medium text-gray-800 text-sm uppercase tracking-wide">Bio</h2>
          <Field label="Short bio (team card / intro)">
            <textarea rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} className="input resize-none" />
          </Field>
          <Field label="Extended bio paragraphs">
            {form.bioExtended.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea
                  rows={2}
                  value={p}
                  onChange={e => {
                    const next = [...form.bioExtended]; next[i] = e.target.value
                    setForm(prev => ({ ...prev, bioExtended: next }))
                  }}
                  className="input resize-none flex-1 text-sm"
                />
                <button onClick={() => setForm(prev => ({ ...prev, bioExtended: prev.bioExtended.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <textarea rows={2} value={bioExtLine} onChange={e => setBioExtLine(e.target.value)} placeholder="Add a paragraph…" className="input resize-none flex-1 text-sm" />
              <button onClick={addBioExt} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"><Plus size={14} /></button>
            </div>
          </Field>
        </section>

        {/* Specialisms */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="font-medium text-gray-800 text-sm uppercase tracking-wide">Specialisms</h2>
          <div className="flex flex-wrap gap-2">
            {form.specialisms.map((s, i) => (
              <span key={i} className="flex items-center gap-1 bg-brand-green/10 text-brand-green text-xs px-2 py-1 rounded-full">
                {s}
                <button onClick={() => setForm(prev => ({ ...prev, specialisms: prev.specialisms.filter((_, j) => j !== i) }))}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={specialism} onChange={e => setSpecialism(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSpecialism()} placeholder="Add specialism…" className="input flex-1 text-sm" />
            <button onClick={addSpecialism} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"><Plus size={14} /></button>
          </div>
        </section>

        {/* Qualifications */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="font-medium text-gray-800 text-sm uppercase tracking-wide">Qualifications</h2>
          <ul className="space-y-1.5">
            {form.qualifications.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-1">{q}</span>
                <button onClick={() => setForm(prev => ({ ...prev, qualifications: prev.qualifications.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 mt-0.5"><X size={13} /></button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input value={qualification} onChange={e => setQualification(e.target.value)} onKeyDown={e => e.key === 'Enter' && addQualification()} placeholder="Add qualification…" className="input flex-1 text-sm" />
            <button onClick={addQualification} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"><Plus size={14} /></button>
          </div>
        </section>

        {/* Treatments */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="font-medium text-gray-800 text-sm uppercase tracking-wide">Treatment links</h2>
          <div className="space-y-2">
            {form.treatments.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="flex-1">{t.label} — <span className="text-gray-400 font-mono text-xs">{t.href}</span></span>
                <button onClick={() => setForm(prev => ({ ...prev, treatments: prev.treatments.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600"><X size={13} /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={treatmentLabel} onChange={e => setTreatmentLabel(e.target.value)} placeholder="Label" className="input flex-1 text-sm" />
            <input value={treatmentHref} onChange={e => setTreatmentHref(e.target.value)} placeholder="/treatments/…" className="input flex-1 text-sm font-mono" />
            <button onClick={addTreatment} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"><Plus size={14} /></button>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-medium text-gray-800 text-sm uppercase tracking-wide">CTA / Booking</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Booking service key">
              <input value={form.bookingService} onChange={e => set('bookingService', e.target.value)} className="input" />
            </Field>
            <Field label="CTA heading">
              <input value={form.ctaHeading} onChange={e => set('ctaHeading', e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="CTA body text">
            <input value={form.ctaBody} onChange={e => set('ctaBody', e.target.value)} className="input" />
          </Field>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-medium text-gray-800 text-sm uppercase tracking-wide">SEO</h2>
          <Field label="Meta title">
            <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} className="input" />
          </Field>
          <Field label={`Meta description (${form.metaDesc.length}/160)`}>
            <textarea rows={2} value={form.metaDesc} onChange={e => set('metaDesc', e.target.value)} className="input resize-none" maxLength={160} />
          </Field>
        </section>

        {/* Save buttons */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save size={15} /> Save as hidden
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
          >
            <Save size={15} /> {isNew ? 'Publish' : 'Save & publish'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('image', file)
      const { data } = await axios.post('/api/upload/team', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(data.url)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-4 py-5 cursor-pointer hover:border-brand-green hover:bg-brand-green/5 transition-colors"
      >
        {uploading ? (
          <Loader size={20} className="animate-spin text-brand-green" />
        ) : (
          <Upload size={20} className="text-gray-400" />
        )}
        <p className="text-xs text-gray-500 text-center">
          {uploading ? 'Uploading…' : 'Click or drag & drop a photo'}
        </p>
        <p className="text-[10px] text-gray-400">JPEG, PNG, WebP · max 5 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
