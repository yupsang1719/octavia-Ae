import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, X, AlertTriangle } from 'lucide-react'
import ItemPicker from '../../../components/admin/stock/ItemPicker'
import { PRACTICES, PRACTICE_LABELS, CENTRAL_PRACTICE } from '../../../data/stockConstants'
import { formatDateShort } from '../../../utils/formatters'

const todayStr = () => new Date().toISOString().slice(0, 10)
const EMPTY_LINE = { itemId: '', qty: '' }

export default function StockTransfer() {
  const [items, setItems] = useState([])
  const [stockByItem, setStockByItem] = useState({}) // itemId -> { practiceSlug: qty }
  const [source, setSource] = useState(CENTRAL_PRACTICE)
  const [destination, setDestination] = useState(PRACTICES.find(p => p.slug !== CENTRAL_PRACTICE).slug)
  const [date, setDate] = useState(todayStr())
  const [lines, setLines] = useState([{ ...EMPTY_LINE }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmOverride, setConfirmOverride] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    axios.get('/api/stock/items', { params: { active: true } }).then(({ data }) => setItems(Array.isArray(data) ? data : [])).catch(console.error)
    axios.get('/api/stock/dashboard').then(({ data }) => {
      const map = {}
      for (const i of data.items || []) map[i._id] = i.stock
      setStockByItem(map)
    }).catch(console.error)
    loadHistory()
  }, [])

  function loadHistory() {
    axios.get('/api/stock/transfers').then(({ data }) => setHistory(Array.isArray(data) ? data : [])).catch(console.error)
  }

  function updateLine(idx, field, value) {
    setLines(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }

  function addLine() {
    setLines(prev => [...prev, { ...EMPTY_LINE }])
  }

  function removeLine(idx) {
    setLines(prev => prev.filter((_, i) => i !== idx))
  }

  function swapDirection() {
    setSource(destination)
    setDestination(source)
  }

  async function submit(e, override = false) {
    if (e) e.preventDefault()
    setError('')
    setSuccess('')

    if (source === destination) {
      setError('Source and destination must be different practices.')
      return
    }

    const validLines = lines.filter(l => l.itemId && l.qty)
    if (validLines.length === 0) {
      setError('Add at least one line with an item and quantity.')
      return
    }

    setSaving(true)
    try {
      await axios.post('/api/stock/transfers', {
        source, destination, date, override,
        lines: validLines.map(l => ({ ...l, qty: Number(l.qty) })),
      })
      setSuccess('Transfer recorded.')
      setLines([{ ...EMPTY_LINE }])
      setConfirmOverride(null)
      loadHistory()
    } catch (err) {
      if (err.response?.data?.code === 'INSUFFICIENT_STOCK') {
        setConfirmOverride({ message: err.response.data.error })
      } else {
        setError(err.response?.data?.error || 'Failed to record transfer')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-dark mb-2">Transfer</h1>
      <p className="text-sm text-brand-muted font-sans mb-6">
        Move stock between any two practices — most transfers will be Central out to a practice, but stock can move the other way too, or directly between Godalming and Hindhead.
      </p>

      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-5">
        <div className="grid sm:grid-cols-[1fr_auto_1fr_1fr] gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">From</label>
            <select value={source} onChange={e => setSource(e.target.value)} className="input">
              {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
            </select>
          </div>
          <button
            type="button" onClick={swapDirection}
            className="mb-0.5 px-2 py-2 border border-gray-300 rounded-lg text-brand-muted hover:border-brand-green hover:text-brand-green transition-colors"
            title="Swap direction"
          >
            ⇄
          </button>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">To</label>
            <select value={destination} onChange={e => setDestination(e.target.value)} className="input">
              {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Date</label>
            <input type="date" value={date} max={todayStr()} onChange={e => setDate(e.target.value)} required className="input" />
          </div>
        </div>
        {source === destination && (
          <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> Source and destination must be different practices.</p>
        )}

        <div className="space-y-3">
          {lines.map((line, idx) => {
            const stock = stockByItem[line.itemId]?.[source]
            const over = line.itemId && line.qty && stock !== undefined && Number(line.qty) > stock
            return (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="grid sm:grid-cols-[1fr_100px_auto] gap-2 items-start">
                  <ItemPicker items={items} value={line.itemId} onChange={v => updateLine(idx, 'itemId', v)} />
                  <input
                    type="number" min="1" step="1" placeholder="Qty"
                    value={line.qty} onChange={e => updateLine(idx, 'qty', e.target.value)}
                    className="input"
                  />
                  <button type="button" onClick={() => removeLine(idx)} className="text-red-400 hover:text-red-600 p-2">
                    <X size={16} />
                  </button>
                </div>
                {line.itemId && (
                  <p className="text-xs text-brand-muted mt-1.5">{PRACTICE_LABELS[source]} stock: {stock ?? '—'}</p>
                )}
                {over && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle size={12} /> Requested qty exceeds stock at {PRACTICE_LABELS[source]}</p>
                )}
              </div>
            )
          })}
        </div>

        <button type="button" onClick={addLine} className="flex items-center gap-1.5 text-sm text-brand-green hover:opacity-80">
          <Plus size={14} /> Add line
        </button>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}

        {confirmOverride && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-3 text-sm">
            <p className="text-amber-800 mb-2">{confirmOverride.message}. Record the transfer anyway?</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => submit(null, true)} className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700">
                Yes, transfer anyway
              </button>
              <button type="button" onClick={() => setConfirmOverride(null)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-gray-400">
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          type="submit" disabled={saving || source === destination}
          className="bg-brand-green text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Record transfer'}
        </button>
      </form>

      <h2 className="font-serif text-lg text-brand-dark mb-3">Transfer history</h2>
      <div className="space-y-3">
        {history.map(t => (
          <div key={t.transferId} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between text-sm mb-2 font-sans">
              <span className="font-medium text-brand-dark">{PRACTICE_LABELS[t.source]} → {PRACTICE_LABELS[t.destination]}</span>
              <span className="text-brand-muted">{formatDateShort(t.date)}</span>
            </div>
            <ul className="text-sm text-brand-muted font-sans space-y-0.5">
              {t.lines.map(l => (
                <li key={l.movementId}>{l.item?.name} — {l.qty} {l.item?.unit}</li>
              ))}
            </ul>
          </div>
        ))}
        {history.length === 0 && <p className="text-sm text-brand-muted font-sans">No transfers recorded yet.</p>}
      </div>
    </div>
  )
}
