import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Copy, Download, Check, RotateCcw } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import StockStatusBadge from '../../../components/admin/stock/StockStatusBadge'
import { PRACTICES, PRACTICE_LABELS, ITEM_CATEGORIES, ITEM_SUPPLIERS, TRANSFER_DESTINATIONS, CENTRAL_PRACTICE } from '../../../data/stockConstants'
import { formatCurrency, formatDateShort } from '../../../utils/formatters'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function StockDashboard() {
  const { role } = useAuth()
  const [items, setItems] = useState([])
  const [stockValue, setStockValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [supplier, setSupplier] = useState('all')
  const [view, setView] = useState('all') // 'all' | 'order-list'
  const [staffPractice, setStaffPractice] = useState(PRACTICES[0].slug)

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (status !== 'all') params.status = status
    if (category !== 'all') params.category = category
    if (supplier !== 'all') params.supplier = supplier
    axios.get('/api/stock/dashboard', { params })
      .then(({ data }) => { setItems(data.items); setStockValue(data.stockValue) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [status, category, supplier])

  const orderListBySupplier = useMemo(() => {
    const needsOrder = items.filter(i => i.stock.status !== 'OK')
    const groups = {}
    for (const i of needsOrder) {
      groups[i.supplier] = groups[i.supplier] || []
      groups[i.supplier].push(i)
    }
    return groups
  }, [items])

  if (role === 'staff') return <StaffStockView practice={staffPractice} setPractice={setStaffPractice} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif text-2xl text-brand-dark">Stock Dashboard</h1>
        <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setView('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-sans transition-colors ${view === 'all' ? 'bg-brand-green text-white' : 'text-brand-muted hover:text-brand-dark'}`}
          >
            All items
          </button>
          <button
            onClick={() => setView('order-list')}
            className={`px-3 py-1.5 rounded-md text-sm font-sans transition-colors ${view === 'order-list' ? 'bg-brand-green text-white' : 'text-brand-muted hover:text-brand-dark'}`}
          >
            Order list
          </button>
          <button
            onClick={() => setView('movements')}
            className={`px-3 py-1.5 rounded-md text-sm font-sans transition-colors ${view === 'movements' ? 'bg-brand-green text-white' : 'text-brand-muted hover:text-brand-dark'}`}
          >
            Movement history
          </button>
        </div>
      </div>

      {view !== 'movements' && (
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-brand-muted font-sans uppercase tracking-wide">Total stock value</p>
            <p className="font-serif text-2xl text-brand-dark mt-1">{formatCurrency(stockValue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-brand-muted font-sans uppercase tracking-wide">Order now</p>
            <p className="font-serif text-2xl text-red-600 mt-1">{items.filter(i => i.stock.status === 'ORDER_NOW').length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-brand-muted font-sans uppercase tracking-wide">Low</p>
            <p className="font-serif text-2xl text-amber-600 mt-1">{items.filter(i => i.stock.status === 'LOW').length}</p>
          </div>
        </div>
      )}

      {view === 'movements' ? (
        <MovementHistoryView />
      ) : view === 'all' ? (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <select value={status} onChange={e => setStatus(e.target.value)} className="input w-auto text-sm">
              <option value="all">All statuses</option>
              <option value="ORDER_NOW">Order now</option>
              <option value="LOW">Low</option>
              <option value="OK">OK</option>
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input w-auto text-sm">
              <option value="all">All categories</option>
              {ITEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={supplier} onChange={e => setSupplier(e.target.value)} className="input w-auto text-sm">
              <option value="all">All suppliers</option>
              {ITEM_SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
            {loading ? <Spinner /> : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Item</th>
                    <th className="text-right px-3 py-3 font-medium">Central</th>
                    <th className="text-right px-3 py-3 font-medium">Godalming</th>
                    <th className="text-right px-3 py-3 font-medium">Hindhead</th>
                    <th className="text-right px-3 py-3 font-medium">Total</th>
                    <th className="text-right px-3 py-3 font-medium hidden md:table-cell">Reorder at</th>
                    <th className="text-left px-3 py-3 font-medium">Status</th>
                    <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Suggested order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map(i => (
                    <tr key={i._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-sans">
                        <p className="font-medium text-brand-dark">{i.name}</p>
                        <p className="text-xs text-brand-muted">{i.sku} · {i.unit}</p>
                      </td>
                      <td className="text-right px-3 py-3 font-sans">{i.stock[CENTRAL_PRACTICE]}</td>
                      <td className="text-right px-3 py-3 font-sans">{i.stock['octavia-aesthetic']}</td>
                      <td className="text-right px-3 py-3 font-sans">{i.stock['new-octavia']}</td>
                      <td className="text-right px-3 py-3 font-sans font-medium">{i.stock.total}</td>
                      <td className="text-right px-3 py-3 font-sans text-brand-muted hidden md:table-cell">{i.reorderLevel}</td>
                      <td className="px-3 py-3"><StockStatusBadge status={i.stock.status} /></td>
                      <td className="text-right px-4 py-3 font-sans hidden lg:table-cell">{i.stock.suggestedOrderQty || '—'}</td>
                    </tr>
                  ))}
                  {items.length === 0 && !loading && (
                    <tr><td colSpan={8} className="text-center text-brand-muted py-10 font-sans">No items match these filters.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <OrderListView groups={orderListBySupplier} />
      )}
    </div>
  )
}

const MOVEMENT_TYPES = ['goods_in', 'transfer', 'usage', 'adjustment']

function MovementHistoryView() {
  const [items, setItems] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ itemId: '', location: '', type: '', from: '', to: '' })

  useEffect(() => {
    axios.get('/api/stock/items').then(({ data }) => setItems(data)).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    axios.get('/api/stock/movements', { params: { ...params, limit: 100 } })
      .then(({ data }) => setMovements(data.movements))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filters])

  function setFilter(field, value) {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  async function reverse(id) {
    if (!confirm('Post an equal-and-opposite adjustment to reverse this movement?')) return
    try {
      await axios.post(`/api/stock/movements/${id}/reverse`)
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      const { data } = await axios.get('/api/stock/movements', { params: { ...params, limit: 100 } })
      setMovements(data.movements)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reverse movement')
    }
  }

  const exportParams = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString()

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select value={filters.itemId} onChange={e => setFilter('itemId', e.target.value)} className="input w-auto text-sm">
          <option value="">All items</option>
          {items.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
        </select>
        <select value={filters.location} onChange={e => setFilter('location', e.target.value)} className="input w-auto text-sm">
          <option value="">All practices</option>
          {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
        </select>
        <select value={filters.type} onChange={e => setFilter('type', e.target.value)} className="input w-auto text-sm">
          <option value="">All types</option>
          {MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="date" value={filters.from} onChange={e => setFilter('from', e.target.value)} className="input w-auto text-sm" />
        <span className="text-brand-muted text-sm">to</span>
        <input type="date" value={filters.to} onChange={e => setFilter('to', e.target.value)} className="input w-auto text-sm" />
        <a
          href={`/api/stock/movements/export.csv${exportParams ? `?${exportParams}` : ''}`}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-brand-green hover:text-brand-green transition-colors ml-auto"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        {loading ? <Spinner /> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-3 py-3 font-medium">Type</th>
                <th className="text-left px-3 py-3 font-medium">Item</th>
                <th className="text-right px-3 py-3 font-medium">Qty</th>
                <th className="text-left px-3 py-3 font-medium">Practice</th>
                <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">By</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.map(m => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-sans">{formatDateShort(m.date)}</td>
                  <td className="px-3 py-3 font-sans capitalize">{m.type.replace('_', ' ')}</td>
                  <td className="px-3 py-3 font-sans">{m.itemId?.name}</td>
                  <td className="text-right px-3 py-3 font-sans">{m.qty}</td>
                  <td className="px-3 py-3 font-sans">{PRACTICE_LABELS[m.location]}</td>
                  <td className="px-3 py-3 font-sans text-brand-muted hidden lg:table-cell">{m.createdBy?.email}</td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => reverse(m._id)} className="flex items-center gap-1 text-xs text-brand-muted hover:text-red-600 ml-auto">
                      <RotateCcw size={12} /> Reverse
                    </button>
                  </td>
                </tr>
              ))}
              {movements.length === 0 && !loading && (
                <tr><td colSpan={7} className="text-center text-brand-muted py-10 font-sans">No movements match these filters.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function OrderListView({ groups }) {
  const suppliers = Object.keys(groups)

  if (suppliers.length === 0) {
    return <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-brand-muted font-sans">Nothing needs ordering right now.</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <a href="/api/stock/dashboard/order-list.csv" className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-brand-green hover:text-brand-green transition-colors">
          <Download size={14} /> Export CSV
        </a>
      </div>
      {suppliers.map(supplier => (
        <SupplierGroup key={supplier} supplier={supplier} items={groups[supplier]} />
      ))}
    </div>
  )
}

function SupplierGroup({ supplier, items }) {
  const [copied, setCopied] = useState(false)

  function copyToClipboard() {
    const lines = items.map(i => `${i.name} — ${i.stock.suggestedOrderQty} x ${i.unit} (currently ${i.stock.total}, reorder at ${i.reorderLevel})`)
    const text = `Order request — ${supplier}\n\n${lines.join('\n')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-brand-dark font-sans">{supplier}</h3>
        <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-sm text-brand-green hover:opacity-80">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy for email'}
        </button>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          {items.map(i => (
            <tr key={i._id}>
              <td className="px-4 py-2.5 font-sans">
                <p className="text-brand-dark">{i.name}</p>
                <p className="text-xs text-brand-muted">Stock: {i.stock.total} · Reorder at: {i.reorderLevel}</p>
              </td>
              <td className="px-4 py-2.5 text-right"><StockStatusBadge status={i.stock.status} /></td>
              <td className="px-4 py-2.5 text-right font-sans font-medium whitespace-nowrap">{i.stock.suggestedOrderQty} x {i.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StaffStockView({ practice, setPractice }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get('/api/stock/dashboard')
      .then(({ data }) => setItems(data.items))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-dark mb-4">Stock levels</h1>
      <select value={practice} onChange={e => setPractice(e.target.value)} className="input w-auto text-sm mb-4">
        {[...TRANSFER_DESTINATIONS, { slug: 'octavia-house', label: PRACTICE_LABELS['octavia-house'] }].map(p => (
          <option key={p.slug} value={p.slug}>{p.label}</option>
        ))}
      </select>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <Spinner /> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Item</th>
                <th className="text-right px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(i => (
                <tr key={i._id}>
                  <td className="px-4 py-3 font-sans">
                    <p className="font-medium text-brand-dark">{i.name}</p>
                    <p className="text-xs text-brand-muted">{i.unit}</p>
                  </td>
                  <td className="text-right px-4 py-3 font-sans font-medium">{i.stock[practice]}</td>
                  <td className="px-4 py-3"><StockStatusBadge status={i.stock.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
