import { useEffect, useState } from 'react'
import axios from 'axios'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DEFAULT_ROWS = DAYS.map(day => ({
  day,
  hours: day === 'Sunday' ? '' : day === 'Saturday' ? '9:00 am – 2:00 pm' : day === 'Friday' ? '8:30 am – 5:00 pm' : '8:30 am – 6:00 pm',
  closed: day === 'Sunday',
}))

export default function AdminOpeningHours() {
  const [rows, setRows]       = useState(DEFAULT_ROWS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    axios.get('/api/settings/opening-hours')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length === 7) setRows(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function update(idx, field, value) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
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
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark">Opening Hours</h1>
          <p className="text-sm text-brand-muted font-sans mt-0.5">Shown on the Contact page.</p>
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
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-sans">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {rows.map((row, idx) => (
          <div key={row.day} className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-28 text-sm font-medium text-brand-dark font-sans flex-shrink-0">{row.day}</span>

            <input
              value={row.hours}
              onChange={e => update(idx, 'hours', e.target.value)}
              placeholder="e.g. 9:00 am – 5:00 pm"
              disabled={row.closed}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:bg-gray-50 disabled:text-brand-subtle disabled:cursor-not-allowed"
            />

            <label className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0">
              <div
                onClick={() => update(idx, 'closed', !row.closed)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${row.closed ? 'bg-brand-green' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${row.closed ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-xs font-sans text-brand-muted">Closed</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
