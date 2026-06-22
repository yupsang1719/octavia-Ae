import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, GripVertical } from 'lucide-react'

const BLANK_ROW = { day: '', hours: '', closed: false }

export default function AdminOpeningHours() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    axios.get('/api/settings/opening-hours')
      .then(({ data }) => setRows(data))
      .catch(() => setError('Failed to load opening hours.'))
      .finally(() => setLoading(false))
  }, [])

  function update(idx, field, value) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
    setSaved(false)
  }

  function addRow() {
    setRows(prev => [...prev, { ...BLANK_ROW }])
    setSaved(false)
  }

  function removeRow(idx) {
    setRows(prev => prev.filter((_, i) => i !== idx))
    setSaved(false)
  }

  async function save() {
    setError('')
    setSaving(true)
    try {
      await axios.put('/api/settings/opening-hours', { hours: rows })
      setSaved(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save.')
    } finally {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark">Opening Hours</h1>
          <p className="text-sm text-brand-muted font-sans mt-0.5">Shown on the Contact page. Changes go live immediately after saving.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2 bg-brand-green text-white text-sm font-sans font-medium rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-sans">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1.5fr_1.5fr_auto_auto] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-brand-muted uppercase tracking-widest font-sans">
          <span>Day / Period</span>
          <span>Hours</span>
          <span>Closed</span>
          <span></span>
        </div>

        {rows.length === 0 && (
          <p className="text-sm text-brand-muted text-center py-10 font-sans">No rows yet. Add one below.</p>
        )}

        <div className="divide-y divide-gray-100">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-[1.5fr_1.5fr_auto_auto] gap-3 items-center px-5 py-3">
              <input
                value={row.day}
                onChange={e => update(idx, 'day', e.target.value)}
                placeholder="e.g. Monday – Friday"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              <input
                value={row.hours}
                onChange={e => update(idx, 'hours', e.target.value)}
                placeholder="e.g. 9:00 am – 5:00 pm"
                disabled={row.closed}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50 disabled:text-brand-subtle disabled:cursor-not-allowed"
              />
              <label className="flex items-center gap-2 cursor-pointer select-none px-1">
                <div
                  onClick={() => update(idx, 'closed', !row.closed)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${row.closed ? 'bg-brand-green' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${row.closed ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-xs font-sans text-brand-muted whitespace-nowrap">Closed</span>
              </label>
              <button
                onClick={() => removeRow(idx)}
                className="p-1.5 rounded hover:bg-red-50 text-brand-subtle hover:text-red-500 transition-colors"
                title="Remove row"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-gray-100">
          <button
            onClick={addRow}
            className="flex items-center gap-2 text-sm font-sans text-brand-green hover:text-brand-green/80 transition-colors"
          >
            <Plus size={15} /> Add row
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-brand-subtle font-sans">
        Tip: you can group days in one row (e.g. "Monday – Thursday") to keep it concise.
      </p>
    </div>
  )
}
