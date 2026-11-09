import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Plus, Trash2, CheckCircle, ChevronUp, ChevronDown, ExternalLink, Link2 } from 'lucide-react'

const EMPTY_ITEM = { name: '', price: '', note: '', href: '' }

function move(list, from, to) {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [x] = next.splice(from, 1)
  next.splice(to, 0, x)
  return next
}

function MoveButtons({ onUp, onDown }) {
  return (
    <div className="flex flex-col shrink-0">
      <button type="button" onClick={onUp} className="p-0.5 text-gray-300 hover:text-brand-dark" aria-label="Move up"><ChevronUp size={14} /></button>
      <button type="button" onClick={onDown} className="p-0.5 text-gray-300 hover:text-brand-dark" aria-label="Move down"><ChevronDown size={14} /></button>
    </div>
  )
}

export default function AdminPriceList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    axios.get('/api/settings/price-list')
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load the price list'))
      .finally(() => setLoading(false))
  }, [])

  function change(fn) {
    setCategories(fn)
    setSaved(false)
  }

  const setCat   = (ci, patch) => change(cs => cs.map((c, i) => i === ci ? { ...c, ...patch } : c))
  const setItems = (ci, fn)    => change(cs => cs.map((c, i) => i === ci ? { ...c, items: fn(c.items) } : c))
  const setItem  = (ci, ii, field, value) => setItems(ci, items => items.map((it, j) => j === ii ? { ...it, [field]: value } : it))
  const moveToCategory = (ci, ii, target) => change(cs => {
    const item = cs[ci].items[ii]
    return cs.map((c, i) => {
      if (i === ci)     return { ...c, items: c.items.filter((_, j) => j !== ii) }
      if (i === target) return { ...c, items: [...c.items, item] }
      return c
    })
  })

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const { data } = await axios.put('/api/settings/price-list', { categories })
      setCategories(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-brand-dark font-medium">Price List</h1>
          <p className="font-sans text-sm text-brand-muted mt-1">
            The tables on the public Price List page. Treatment rows take their name and price from <Link to="/admin/treatments" className="text-brand-green underline">Treatments</Link> automatically — edit prices there. Add extra rows here for services without a treatment page (check-ups, extractions, etc.).
          </p>
        </div>
        <a href="/prices" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-green hover:underline">
          View page <ExternalLink size={13} />
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {categories.map((cat, ci) => (
              <div key={ci} className="bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                  <MoveButtons
                    onUp={() => change(cs => move(cs, ci, ci - 1))}
                    onDown={() => change(cs => move(cs, ci, ci + 1))}
                  />
                  <input
                    type="text"
                    value={cat.category}
                    onChange={e => setCat(ci, { category: e.target.value })}
                    placeholder="Category name"
                    className="input text-sm font-medium flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (cat.items.some(it => it.linked)) {
                        window.alert('Move the treatment rows to another category first — treatments always stay on the price list while published.')
                        return
                      }
                      if (window.confirm(`Remove the "${cat.category || 'untitled'}" category and all its rows?`)) change(cs => cs.filter((_, i) => i !== ci))
                    }}
                    className="p-1.5 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                    aria-label="Remove category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cat.items.map((item, ii) => (
                    <div key={item.href || ii} className="flex items-start gap-3 px-4 py-3">
                      <div className="pt-5">
                        <MoveButtons
                          onUp={() => setItems(ci, items => move(items, ii, ii - 1))}
                          onDown={() => setItems(ci, items => move(items, ii, ii + 1))}
                        />
                      </div>
                      {item.linked ? (
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px] gap-2 flex-1">
                          <div>
                            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Treatment</label>
                            <p className="font-sans text-sm text-brand-dark py-2 flex items-center gap-1.5">
                              {item.name}
                              <Link to={`/admin/treatments/${item.href.split('/').pop()}`} className="inline-flex items-center gap-1 text-[11px] text-brand-green bg-brand-green/10 rounded-full px-2 py-0.5 hover:bg-brand-green/20" title="Name and price come from Treatments">
                                <Link2 size={11} /> From Treatments
                              </Link>
                            </p>
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Price</label>
                            <p className="font-sans text-sm text-brand-dark py-2">{item.price}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Note (optional)</label>
                            <input type="text" value={item.note} onChange={e => setItem(ci, ii, 'note', e.target.value)} placeholder="Includes consultation" className="input text-sm" />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px] gap-2 flex-1">
                          <div>
                            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Service</label>
                            <input type="text" value={item.name} onChange={e => setItem(ci, ii, 'name', e.target.value)} placeholder="Check-up" className="input text-sm" />
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Price</label>
                            <input type="text" value={item.price} onChange={e => setItem(ci, ii, 'price', e.target.value)} placeholder="£65" className="input text-sm" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-sans text-[10px] text-brand-muted uppercase tracking-wide mb-1">Note (optional)</label>
                            <input type="text" value={item.note} onChange={e => setItem(ci, ii, 'note', e.target.value)} placeholder="Includes X-rays" className="input text-sm" />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col items-end gap-2 shrink-0 pt-5">
                        {categories.length > 1 && (
                          <select
                            value={ci}
                            onChange={e => moveToCategory(ci, ii, Number(e.target.value))}
                            className="text-xs font-sans border border-gray-200 rounded px-1.5 py-1 text-brand-muted max-w-[9rem]"
                            aria-label="Move to category"
                          >
                            {categories.map((c, k) => <option key={k} value={k}>{k === ci ? 'Move to…' : (c.category || 'Untitled')}</option>)}
                          </select>
                        )}
                        {!item.linked && (
                          <button
                            type="button"
                            onClick={() => setItems(ci, items => items.filter((_, j) => j !== ii))}
                            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                            aria-label="Remove row"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="px-4 py-3">
                    <button type="button" onClick={() => setItems(ci, items => [...items, { ...EMPTY_ITEM }])}
                      className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-green hover:text-brand-green/80 transition-colors">
                      <Plus size={14} /> Add service
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => change(cs => [...cs, { category: '', items: [{ ...EMPTY_ITEM }] }])}
            className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm text-brand-green border border-dashed border-brand-green/40 rounded-lg px-4 py-2.5 hover:bg-brand-green/5 transition-colors">
            <Plus size={14} /> Add category
          </button>

          <div className="flex items-center gap-3 mt-6">
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
        </>
      )}
    </div>
  )
}
