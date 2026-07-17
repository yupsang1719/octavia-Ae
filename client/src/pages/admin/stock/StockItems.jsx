import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { ITEM_CATEGORIES, ITEM_SUPPLIERS, COUNT_TIERS } from '../../../data/stockConstants'
import { formatCurrency } from '../../../utils/formatters'

const EMPTY = {
  name: '', category: ITEM_CATEGORIES[0], supplier: ITEM_SUPPLIERS[0], unit: '',
  packSize: 1, costPerUnit: 0, reorderLevel: 0, reorderQty: 0, countTier: 'monthly', notes: '',
}

export default function StockItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInactive, setShowInactive] = useState(false)
  const [adding, setAdding] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { load() }, [])

  function load() {
    setLoading(true)
    axios.get('/api/stock/items').then(({ data }) => setItems(Array.isArray(data) ? data : [])).catch(console.error).finally(() => setLoading(false))
  }

  const visible = items.filter(i => showInactive || i.active)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif text-2xl text-brand-dark">Items</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-brand-muted font-sans cursor-pointer">
            <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} className="rounded" />
            Show inactive
          </label>
          <button
            onClick={() => setAdding(v => !v)}
            className="flex items-center gap-1.5 bg-brand-green text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-green/90"
          >
            <Plus size={14} /> New item
          </button>
        </div>
      </div>

      {adding && <ItemForm onSaved={() => { setAdding(false); load() }} onCancel={() => setAdding(false)} />}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">SKU</th>
                <th className="text-left px-3 py-3 font-medium">Name</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-right px-3 py-3 font-medium hidden lg:table-cell">Cost/unit</th>
                <th className="text-right px-3 py-3 font-medium">Reorder at</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(item => (
                <Fragment key={item._id}>
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer ${!item.active ? 'opacity-50' : ''}`}
                    onClick={() => setExpanded(e => e === item._id ? null : item._id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-brand-muted">{item.sku}</td>
                    <td className="px-3 py-3 font-sans font-medium text-brand-dark">{item.name}{!item.active && ' (inactive)'}</td>
                    <td className="px-3 py-3 font-sans text-brand-muted hidden md:table-cell">{item.category}</td>
                    <td className="text-right px-3 py-3 font-sans hidden lg:table-cell">{formatCurrency(item.costPerUnit)}</td>
                    <td className="text-right px-3 py-3 font-sans">{item.reorderLevel}</td>
                    <td className="px-3 py-3 text-brand-muted">
                      {expanded === item._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>
                  {expanded === item._id && (
                    <tr>
                      <td colSpan={6} className="px-5 py-5 bg-gray-50 border-t border-gray-100">
                        <ItemForm
                          item={item}
                          onSaved={() => { setExpanded(null); load() }}
                          onCancel={() => setExpanded(null)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {visible.length === 0 && !loading && (
                <tr><td colSpan={6} className="text-center text-brand-muted py-10 font-sans">No items found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function ItemForm({ item, onSaved, onCancel }) {
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      if (item) {
        await axios.patch(`/api/stock/items/${item._id}`, form)
      } else {
        await axios.post('/api/stock/items', form)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive() {
    setSaving(true)
    try {
      await axios.patch(`/api/stock/items/${item._id}`, { active: !item.active })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update')
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-4" onClick={e => e.stopPropagation()}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input value={form.name} onChange={e => set('name', e.target.value)} className="input" />
        </Field>
        <Field label="Unit">
          <input value={form.unit} onChange={e => set('unit', e.target.value)} className="input" placeholder="e.g. Box of 50" />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
            {ITEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Supplier">
          <select value={form.supplier} onChange={e => set('supplier', e.target.value)} className="input">
            {ITEM_SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Pack size">
          <input type="number" min="1" value={form.packSize} onChange={e => set('packSize', Number(e.target.value))} className="input" />
        </Field>
        <Field label="Cost per unit (£)">
          <input type="number" min="0" step="0.01" value={form.costPerUnit} onChange={e => set('costPerUnit', Number(e.target.value))} className="input" />
        </Field>
        <Field label="Reorder level (total units)">
          <input type="number" min="0" value={form.reorderLevel} onChange={e => set('reorderLevel', Number(e.target.value))} className="input" />
        </Field>
        <Field label="Reorder qty">
          <input type="number" min="0" value={form.reorderQty} onChange={e => set('reorderQty', Number(e.target.value))} className="input" />
        </Field>
        <Field label="Count tier">
          <select value={form.countTier} onChange={e => set('countTier', e.target.value)} className="input">
            {COUNT_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Notes">
        <textarea rows={2} value={form.notes || ''} onChange={e => set('notes', e.target.value)} className="input resize-none" />
      </Field>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="bg-brand-green text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-brand-green/90 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-gray-400">
            Cancel
          </button>
        </div>
        {item && (
          <button onClick={toggleActive} disabled={saving} className="text-sm text-red-500 hover:text-red-700">
            {item.active ? 'Deactivate' : 'Reactivate'}
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-brand-muted">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
