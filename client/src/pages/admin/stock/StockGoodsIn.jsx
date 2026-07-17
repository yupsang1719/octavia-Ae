import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, X } from 'lucide-react'
import ItemPicker from '../../../components/admin/stock/ItemPicker'
import { ITEM_SUPPLIERS, BATCH_REQUIRED_CATEGORIES } from '../../../data/stockConstants'
import { formatDateShort } from '../../../utils/formatters'

const todayStr = () => new Date().toISOString().slice(0, 10)

const EMPTY_LINE = { itemId: '', qty: '', batchNo: '', expiryDate: '' }

export default function StockGoodsIn() {
  const [items, setItems] = useState([])
  const [date, setDate] = useState(todayStr())
  const [supplier, setSupplier] = useState(ITEM_SUPPLIERS[0])
  const [invoiceRef, setInvoiceRef] = useState('')
  const [lines, setLines] = useState([{ ...EMPTY_LINE }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    axios.get('/api/stock/items', { params: { active: true } }).then(({ data }) => setItems(data)).catch(console.error)
    loadHistory()
  }, [])

  function loadHistory() {
    axios.get('/api/stock/goods-in').then(({ data }) => setHistory(data)).catch(console.error)
  }

  function itemFor(itemId) {
    return items.find(i => i._id === itemId)
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

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validLines = lines.filter(l => l.itemId && l.qty)
    if (validLines.length === 0) {
      setError('Add at least one line with an item and quantity.')
      return
    }

    setSaving(true)
    try {
      await axios.post('/api/stock/goods-in', {
        date, supplier, invoiceRef,
        lines: validLines.map(l => ({ ...l, qty: Number(l.qty) })),
      })
      setSuccess('Delivery recorded.')
      setLines([{ ...EMPTY_LINE }])
      setInvoiceRef('')
      loadHistory()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record delivery')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-dark mb-6">Goods In</h1>

      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Date</label>
            <input type="date" value={date} max={todayStr()} onChange={e => setDate(e.target.value)} required className="input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Supplier</label>
            <select value={supplier} onChange={e => setSupplier(e.target.value)} className="input">
              {ITEM_SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Invoice / delivery ref</label>
            <input value={invoiceRef} onChange={e => setInvoiceRef(e.target.value)} className="input" placeholder="Optional" />
          </div>
        </div>

        <div className="space-y-3">
          {lines.map((line, idx) => {
            const item = itemFor(line.itemId)
            const batchWarn = item && BATCH_REQUIRED_CATEGORIES.includes(item.category) && (!line.batchNo || !line.expiryDate)
            return (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="grid sm:grid-cols-[1fr_100px_140px_150px_auto] gap-2 items-start">
                  <ItemPicker items={items} value={line.itemId} onChange={v => updateLine(idx, 'itemId', v)} />
                  <input
                    type="number" min="1" step="1" placeholder="Qty"
                    value={line.qty} onChange={e => updateLine(idx, 'qty', e.target.value)}
                    className="input"
                  />
                  <input
                    type="text" placeholder="Batch no."
                    value={line.batchNo} onChange={e => updateLine(idx, 'batchNo', e.target.value)}
                    className="input"
                  />
                  <input
                    type="date" placeholder="Expiry"
                    value={line.expiryDate} onChange={e => updateLine(idx, 'expiryDate', e.target.value)}
                    className="input"
                  />
                  <button type="button" onClick={() => removeLine(idx)} className="text-red-400 hover:text-red-600 p-2">
                    <X size={16} />
                  </button>
                </div>
                {batchWarn && (
                  <p className="text-xs text-amber-600 mt-1.5">Batch no. and expiry date are required for {item.category} items.</p>
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

        <button
          type="submit" disabled={saving}
          className="bg-brand-green text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Record delivery'}
        </button>
      </form>

      <h2 className="font-serif text-lg text-brand-dark mb-3">Delivery history</h2>
      <div className="space-y-3">
        {history.map(d => (
          <div key={d.deliveryId} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between text-sm mb-2 font-sans">
              <span className="font-medium text-brand-dark">{d.supplier}{d.invoiceRef ? ` — ${d.invoiceRef}` : ''}</span>
              <span className="text-brand-muted">{formatDateShort(d.date)}</span>
            </div>
            <ul className="text-sm text-brand-muted font-sans space-y-0.5">
              {d.lines.map(l => (
                <li key={l.movementId}>{l.item?.name} — {l.qty} {l.item?.unit}{l.batchNo ? ` (batch ${l.batchNo})` : ''}</li>
              ))}
            </ul>
          </div>
        ))}
        {history.length === 0 && <p className="text-sm text-brand-muted font-sans">No deliveries recorded yet.</p>}
      </div>
    </div>
  )
}
