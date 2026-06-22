import { useState, useEffect } from 'react'
import axios from 'axios'
import { GripVertical, Plus, Trash2, CheckCircle } from 'lucide-react'

const DEFAULTS = [
  { value: '500+', label: 'Happy patients' },
  { value: '5.0★', label: 'Google rating' },
  { value: '2',    label: 'Specialist dentists' },
  { value: 'Free', label: 'Consultations' },
  { value: 'None', label: 'Waiting list' },
]

export default function AdminTrustBar() {
  const [stats, setStats]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    axios.get('/api/settings/trust-bar')
      .then(({ data }) => setStats(data.length ? data : DEFAULTS))
      .catch(() => setStats(DEFAULTS))
      .finally(() => setLoading(false))
  }, [])

  function update(index, field, value) {
    setStats(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
    setSaved(false)
  }

  function addStat() {
    setStats(prev => [...prev, { value: '', label: '' }])
    setSaved(false)
  }

  function removeStat(index) {
    setStats(prev => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await axios.put('/api/settings/trust-bar', { stats })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-brand-dark font-medium">Trust Bar</h1>
        <p className="font-sans text-sm text-brand-muted mt-1">
          The stats strip shown directly below the hero on the homepage.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Preview strip */}
          <div className="bg-brand-dark rounded-xl px-4 py-5 mb-6 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-2xl font-medium text-brand-gold">{stat.value || '—'}</div>
                <div className="font-sans text-[10px] text-white/45 uppercase tracking-widest mt-1">{stat.label || '—'}</div>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <GripVertical size={16} className="text-gray-300 shrink-0" />
                <div className="grid grid-cols-[100px_1fr] gap-3 flex-1">
                  <div>
                    <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={e => update(i, 'value', e.target.value)}
                      placeholder="500+"
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={e => update(i, 'label', e.target.value)}
                      placeholder="Happy patients"
                      className="input text-sm"
                    />
                  </div>
                </div>
                <button onClick={() => removeStat(i)}
                  className="p-1.5 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            <div className="px-4 py-3">
              <button onClick={addStat}
                className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-green hover:text-brand-green/80 transition-colors">
                <Plus size={14} /> Add stat
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
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

          <p className="font-sans text-xs text-brand-muted mt-4 leading-relaxed">
            <strong>Value examples:</strong> <code className="bg-gray-100 px-1 rounded">500+</code> &nbsp;
            <code className="bg-gray-100 px-1 rounded">5.0★</code> &nbsp;
            <code className="bg-gray-100 px-1 rounded">Free</code> &nbsp;
            <code className="bg-gray-100 px-1 rounded">None</code><br/>
            Numbers animate on scroll. Text values display statically.
          </p>
        </>
      )}
    </div>
  )
}
