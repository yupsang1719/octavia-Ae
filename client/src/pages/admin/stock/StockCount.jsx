import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Check } from 'lucide-react'
import { PRACTICES } from '../../../data/stockConstants'

export default function StockCount() {
  const [practice, setPractice] = useState(PRACTICES[0].slug)
  const [tier, setTier] = useState('weekly')
  const [items, setItems] = useState([])
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    setLoading(true)
    setValues({})
    setResult(null)
    axios.get('/api/stock/count/items', { params: { practice, tier } })
      .then(({ data }) => setItems(data))
      .catch(() => setError('Failed to load count sheet'))
      .finally(() => setLoading(false))
  }, [practice, tier])

  const grouped = useMemo(() => {
    const groups = {}
    for (const item of items) {
      groups[item.category] = groups[item.category] || []
      groups[item.category].push(item)
    }
    return groups
  }, [items])

  const countedN = Object.values(values).filter(v => v !== '' && v !== undefined).length

  async function submit() {
    setSubmitting(true)
    setError('')
    try {
      const entries = items.map(i => ({
        itemId: i._id,
        countedQty: values[i._id] === undefined || values[i._id] === '' ? null : Number(values[i._id]),
      }))
      const { data } = await axios.post('/api/stock/count', { practice, tier, entries })
      setResult(data.summary)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit count')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto text-center py-10 px-4">
        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={24} />
        </div>
        <h1 className="font-serif text-xl text-brand-dark mb-2">Count submitted</h1>
        <p className="text-brand-muted font-sans mb-6">
          {result.adjusted} item{result.adjusted === 1 ? '' : 's'} adjusted, {result.matched} matched
          {result.skipped ? `, ${result.skipped} skipped` : ''}.
        </p>
        <button
          onClick={() => { setResult(null); setValues({}) }}
          className="w-full bg-brand-green text-white font-medium py-3.5 rounded-lg text-base"
        >
          Start another count
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto pb-28">
      <h1 className="font-serif text-xl text-brand-dark mb-4 px-1">Stock count</h1>

      <select
        value={practice}
        onChange={e => setPractice(e.target.value)}
        className="input text-base py-3 mb-3"
      >
        {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
      </select>

      <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1 mb-4">
        {[{ v: 'weekly', l: 'Weekly' }, { v: 'monthly', l: 'Monthly full count' }].map(t => (
          <button
            key={t.v}
            onClick={() => setTier(t.v)}
            className={`flex-1 py-2.5 rounded-md text-sm font-sans font-medium transition-colors ${
              tier === t.v ? 'bg-brand-green text-white' : 'text-brand-muted'
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category}>
              <h2 className="text-xs font-medium text-brand-muted uppercase tracking-wide mb-2 px-1">{category}</h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {catItems.map(item => (
                  <div key={item._id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-dark truncate">{item.name}</p>
                      <p className="text-xs text-brand-muted">{item.unit}</p>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="1"
                      placeholder="—"
                      value={values[item._id] ?? ''}
                      onChange={e => setValues(prev => ({ ...prev, [item._id]: e.target.value }))}
                      className="w-20 text-center text-lg font-medium border border-gray-200 rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-brand-muted font-sans text-center py-10">No items in this count.</p>}
        </div>
      )}

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-56 bg-white border-t border-gray-200 p-4 z-10">
          <div className="max-w-md mx-auto">
            <button
              onClick={submit}
              disabled={submitting}
              className="w-full bg-brand-green text-white font-medium py-3.5 rounded-lg text-base disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : `Submit count (${countedN}/${items.length} counted)`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
