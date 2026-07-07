import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAdminPractice } from '../../contexts/AdminPracticeContext'

const FIELD = ({ label, name, value, onChange, type = 'text', hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
    />
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
)

export default function AdminPracticeSettings() {
  const { selectedSlug } = useAdminPractice()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    axios.get(`/api/practice/${selectedSlug}`)
      .then(({ data }) => setForm(data))
      .catch(() => setError('Failed to load practice settings'))
      .finally(() => setLoading(false))
  }, [selectedSlug])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await axios.patch(`/api/practice/${selectedSlug}`, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading…</div>
  if (!form)   return <div className="text-red-600 text-sm">{error || 'Practice not found.'}</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Practice Settings</h1>
      <p className="text-sm text-gray-500 mb-8">
        Contact details and meta info for <strong>{form.name}</strong>.
        Changes go live immediately after saving.
      </p>

      {error && <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Contact */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Contact</h2>
          <div className="space-y-4">
            <FIELD label="Practice name" name="name" value={form.name ?? ''} onChange={handleChange} />
            <FIELD label="Phone" name="phone" value={form.phone ?? ''} onChange={handleChange} type="tel" hint="Displayed on site and in booking modal." />
            <FIELD label="Email" name="email" value={form.email ?? ''} onChange={handleChange} type="email" />
            <FIELD label="Address" name="address" value={form.address ?? ''} onChange={handleChange} />
            <FIELD label="WhatsApp number" name="whatsapp" value={form.whatsapp ?? ''} onChange={handleChange} hint="International format, no +. Leave blank to hide WhatsApp button." />
            <FIELD label="Instagram URL" name="instagram" value={form.instagram ?? ''} onChange={handleChange} hint="Full URL e.g. https://instagram.com/handle. Leave blank to hide." />
            <FIELD label="Google Maps URL" name="googleMapsUrl" value={form.googleMapsUrl ?? ''} onChange={handleChange} />
          </div>
        </section>

        {/* Type */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Practice Type</h2>
          <div className="flex gap-4">
            {['private', 'nhs', 'mixed'].map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={form.type === t}
                  onChange={handleChange}
                  className="accent-brand-green"
                />
                <span className="text-sm text-gray-700 capitalize">{t === 'mixed' ? 'NHS + Private' : t.toUpperCase()}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">Controls "waiting list" notice in footer and treatment page labels.</p>
        </section>

        {/* SEO */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">SEO & Meta</h2>
          <div className="space-y-4">
            <FIELD label="Tagline" name="tagline" value={form.tagline ?? ''} onChange={handleChange} hint="Short description shown in some page intros." />
            <FIELD label="Meta title" name="metaTitle" value={form.metaTitle ?? ''} onChange={handleChange} hint="Shown in browser tab and Google. Keep under 60 characters." />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
              <textarea
                name="metaDesc"
                value={form.metaDesc ?? ''}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              />
              <p className="mt-1 text-xs text-gray-400">Shown in Google search results. Keep under 160 characters.</p>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-green text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
        </div>
      </form>
    </div>
  )
}
