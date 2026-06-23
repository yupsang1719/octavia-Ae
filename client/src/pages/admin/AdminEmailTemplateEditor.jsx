import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'

const BLANK = { name: '', subject: '', bodyHtml: '', type: 'marketing' }

export default function AdminEmailTemplateEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm]     = useState(BLANK)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (isNew) return
    axios.get(`/api/email-templates/${id}`)
      .then(({ data }) => setForm({ name: data.name, subject: data.subject, bodyHtml: data.bodyHtml, type: data.type }))
      .catch(() => setError('Failed to load template.'))
      .finally(() => setLoading(false))
  }, [id, isNew])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function save() {
    setError('')
    setSaving(true)
    try {
      if (isNew) {
        await axios.post('/api/email-templates', form)
      } else {
        await axios.put(`/api/email-templates/${id}`, form)
      }
      navigate('/admin/email-templates')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save.')
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/email-templates')} className="p-1.5 rounded hover:bg-gray-200 text-brand-muted transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-serif text-2xl text-brand-dark">{isNew ? 'New Template' : 'Edit Template'}</h1>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-sans">{error}</div>
      )}

      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Template name *">
            <input value={form.name} onChange={e => set('name', e.target.value)} className={inp} placeholder="e.g. Post-Invisalign Follow Up" />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>
              <option value="marketing">Marketing</option>
              <option value="review_request">Review Request (adds Google CTA)</option>
            </select>
          </Field>
        </div>

        <Field label="Email subject *" hint="Merge tags work here too">
          <input value={form.subject} onChange={e => set('subject', e.target.value)} className={inp} placeholder="e.g. Checking in, {{firstName}} — Octavia Dental" />
        </Field>

        <Field label="Body (HTML) *" hint="Use <p>, <strong>, <ul>, <li>. Merge tags: {{firstName}}, {{name}}, {{treatment}}, {{clinician}}">
          <textarea
            value={form.bodyHtml}
            onChange={e => set('bodyHtml', e.target.value)}
            rows={14}
            className={`${inp} font-mono text-xs resize-y`}
            placeholder={`<p>Hi {{firstName}},</p>\n\n<p>We hope you're enjoying the results of your recent treatment...</p>`}
          />
        </Field>

        {/* Live preview */}
        {form.bodyHtml && (
          <div>
            <p className="text-xs font-medium text-brand-muted uppercase tracking-widest font-sans mb-2">Body preview</p>
            <div
              className="blog-body bg-white border border-gray-200 rounded-xl p-5 text-sm"
              dangerouslySetInnerHTML={{ __html: form.bodyHtml }}
            />
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving || !form.name || !form.subject || !form.bodyHtml}
            className="flex items-center gap-2 px-5 py-2 bg-brand-green text-white text-sm font-sans font-medium rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50"
          >
            <Save size={15} /> {saving ? 'Saving…' : 'Save template'}
          </button>
          <button onClick={() => navigate('/admin/email-templates')} className="text-sm font-sans text-brand-muted hover:text-brand-dark transition-colors">
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

const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-shadow'
