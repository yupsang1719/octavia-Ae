import { useEffect, useState } from 'react'
import axios from 'axios'
import { Check } from 'lucide-react'
import ItemPicker from '../../../components/admin/stock/ItemPicker'
import { PRACTICES, USAGE_REASONS } from '../../../data/stockConstants'

export default function StockQuickLog() {
  const [items, setItems] = useState([])
  const [practice, setPractice] = useState(PRACTICES[0].slug)
  const [itemId, setItemId] = useState('')
  const [qty, setQty] = useState('1')
  const [reason, setReason] = useState('wasted')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    axios.get('/api/stock/items', { params: { active: true } }).then(({ data }) => setItems(Array.isArray(data) ? data : [])).catch(console.error)
  }, [])

  function reset() {
    setItemId('')
    setQty('1')
    setReason('wasted')
    setNote('')
    setDone(false)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!itemId) { setError('Choose an item.'); return }
    if (!qty || Number(qty) <= 0) { setError('Enter a quantity.'); return }

    setSaving(true)
    try {
      await axios.post('/api/stock/quick-log', { practice, itemId, qty: Number(qty), reason, note })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-14 px-4">
        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={24} />
        </div>
        <h1 className="font-serif text-xl text-brand-dark mb-6">Logged</h1>
        <button onClick={reset} className="w-full bg-brand-green text-white font-medium py-3.5 rounded-lg text-base">
          Log another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-serif text-xl text-brand-dark mb-4 px-1">Quick log</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Practice</label>
          <select value={practice} onChange={e => setPractice(e.target.value)} className="input text-base py-3">
            {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Item</label>
          <ItemPicker items={items} value={itemId} onChange={setItemId} className="text-base py-3" placeholder="Search item…" />
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Quantity</label>
          <input
            type="number" inputMode="numeric" min="1" step="1"
            value={qty} onChange={e => setQty(e.target.value)}
            className="input text-lg py-3 text-center w-32"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Reason</label>
          <div className="grid grid-cols-2 gap-2">
            {USAGE_REASONS.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setReason(r.value)}
                className={`py-3 rounded-lg text-sm font-medium border transition-colors ${
                  reason === r.value
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'border-gray-300 text-brand-muted'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Note (optional)</label>
          <input value={note} onChange={e => setNote(e.target.value)} className="input text-base py-3" />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit" disabled={saving}
          className="w-full bg-brand-green text-white font-medium py-3.5 rounded-lg text-base disabled:opacity-60"
        >
          {saving ? 'Logging…' : 'Log it'}
        </button>
      </form>
    </div>
  )
}
