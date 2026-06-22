import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Plus, Trash2, CheckCircle, ChevronLeft, GripVertical } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-muted">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function StringList({ items, onChange, placeholder }) {
  function update(i, val) {
    const next = [...items]
    next[i] = val
    onChange(next)
  }
  function add() { onChange([...items, '']) }
  function remove(i) { onChange(items.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <GripVertical size={16} className="text-gray-300 mt-2.5 shrink-0" />
          <input
            type="text"
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
            className="input text-sm flex-1"
          />
          <button onClick={() => remove(i)} className="p-2 text-gray-300 hover:text-red-400 transition-colors shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-green hover:text-brand-green/80 transition-colors mt-1">
        <Plus size={14} /> Add item
      </button>
    </div>
  )
}

function ParagraphList({ items, onChange }) {
  function update(i, val) {
    const next = [...items]
    next[i] = val
    onChange(next)
  }
  function add() { onChange([...items, '']) }
  function remove(i) { onChange(items.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-3">
      {items.map((para, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            value={para}
            onChange={e => update(i, e.target.value)}
            rows={3}
            placeholder="Paragraph text…"
            className="input text-sm flex-1 resize-none"
          />
          <button onClick={() => remove(i)} className="p-2 text-gray-300 hover:text-red-400 transition-colors shrink-0 self-start mt-1">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-green hover:text-brand-green/80 transition-colors">
        <Plus size={14} /> Add paragraph
      </button>
    </div>
  )
}

function ProcessEditor({ steps, onChange }) {
  function update(i, field, val) {
    const next = steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    onChange(next)
  }
  function add() {
    onChange([...steps, { step: steps.length + 1, title: '', body: '' }])
  }
  function remove(i) {
    onChange(steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, step: idx + 1 })))
  }

  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs font-sans font-semibold flex items-center justify-center shrink-0">
              {step.step}
            </span>
            <button onClick={() => remove(i)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
          <div>
            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Step title</label>
            <input
              type="text"
              value={step.title}
              onChange={e => update(i, 'title', e.target.value)}
              placeholder="Step title"
              className="input text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Description</label>
            <textarea
              value={step.body}
              onChange={e => update(i, 'body', e.target.value)}
              rows={2}
              placeholder="Step description"
              className="input text-sm resize-none"
            />
          </div>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-green hover:text-brand-green/80 transition-colors">
        <Plus size={14} /> Add step
      </button>
    </div>
  )
}

function FAQEditor({ faqs, onChange }) {
  function update(i, field, val) {
    onChange(faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f))
  }
  function add() { onChange([...faqs, { q: '', a: '' }]) }
  function remove(i) { onChange(faqs.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-sans text-[10px] uppercase tracking-wide text-brand-muted font-semibold">Q{i + 1}</span>
            <button onClick={() => remove(i)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
          <div>
            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Question</label>
            <input
              type="text"
              value={faq.q}
              onChange={e => update(i, 'q', e.target.value)}
              placeholder="Question"
              className="input text-sm"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Answer</label>
            <textarea
              value={faq.a}
              onChange={e => update(i, 'a', e.target.value)}
              rows={3}
              placeholder="Answer"
              className="input text-sm resize-none"
            />
          </div>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-green hover:text-brand-green/80 transition-colors">
        <Plus size={14} /> Add FAQ
      </button>
    </div>
  )
}

export default function AdminTreatmentEditor() {
  const { slug } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`/api/treatments/${slug}`)
      .then(({ data }) => setForm(data))
      .catch(() => setError('Failed to load treatment'))
      .finally(() => setLoading(false))
  }, [slug])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const { data } = await axios.patch(`/api/treatments/${slug}`, {
        tagline:          form.tagline,
        priceFrom:        form.priceFrom,
        priceNote:        form.priceNote,
        financeAvailable: form.financeAvailable,
        whatIsIt:         form.whatIsIt,
        benefits:         form.benefits,
        process:          form.process,
        faq:              form.faq,
      })
      setForm(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="max-w-2xl">
        <p className="font-sans text-sm text-red-600">{error || 'Treatment not found.'}</p>
        <Link to="/admin/treatments" className="font-sans text-sm text-brand-green mt-3 inline-block">← Back to treatments</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/treatments" className="text-brand-muted hover:text-brand-dark transition-colors">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-brand-dark font-medium">{form.name}</h1>
          <p className="font-sans text-xs text-brand-muted mt-0.5">/treatments/{slug}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      {/* Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Price from</label>
            <input type="text" value={form.priceFrom || ''} onChange={e => set('priceFrom', e.target.value)}
              placeholder="£2,500" className="input text-sm" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="finance" checked={!!form.financeAvailable}
              onChange={e => set('financeAvailable', e.target.checked)}
              className="w-4 h-4 accent-brand-green" />
            <label htmlFor="finance" className="font-sans text-sm text-brand-dark">Finance available</label>
          </div>
        </div>
        <div>
          <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Price note</label>
          <input type="text" value={form.priceNote || ''} onChange={e => set('priceNote', e.target.value)}
            placeholder="Single implant from £2,500. Full cost at consultation."
            className="input text-sm" />
        </div>
      </Section>

      {/* Tagline */}
      <Section title="Tagline">
        <p className="font-sans text-xs text-brand-muted mb-3">Shown on the hero and services grid on the homepage.</p>
        <input type="text" value={form.tagline || ''} onChange={e => set('tagline', e.target.value)}
          placeholder="Permanent. Natural-looking. Life-changing."
          className="input text-sm" />
      </Section>

      {/* What is it */}
      <Section title="What is it — paragraphs">
        <ParagraphList items={form.whatIsIt || []} onChange={v => set('whatIsIt', v)} />
      </Section>

      {/* Benefits */}
      <Section title="Benefits">
        <StringList
          items={form.benefits || []}
          onChange={v => set('benefits', v)}
          placeholder="Benefit point…"
        />
      </Section>

      {/* Process */}
      <Section title="Process steps">
        <ProcessEditor steps={form.process || []} onChange={v => set('process', v)} />
      </Section>

      {/* FAQ */}
      <Section title="FAQ">
        <FAQEditor faqs={form.faq || []} onChange={v => set('faq', v)} />
      </Section>

      {/* Save */}
      <div className="flex items-center gap-3 mt-2 pb-8">
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2.5 bg-brand-green text-white font-sans text-sm font-medium rounded-lg hover:bg-brand-green/90 disabled:opacity-60 transition-colors">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 font-sans text-sm text-green-600">
            <CheckCircle size={15} /> Saved
          </span>
        )}
      </div>
    </div>
  )
}
