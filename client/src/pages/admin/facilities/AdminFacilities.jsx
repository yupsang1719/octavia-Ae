import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { PRACTICES, PRACTICE_LABELS } from '../../../data/stockConstants'
import { VISIT_TYPES, VISIT_TYPE_LABELS, DUE_STATUS_STYLES, DUE_STATUS_LABELS } from '../../../data/facilitiesConstants'
import { formatDateShort } from '../../../utils/formatters'

const TABS = [
  { key: 'due-soon', label: 'Due Soon' },
  { key: 'visits', label: 'Visits' },
  { key: 'equipment', label: 'Equipment' },
]

const todayStr = () => new Date().toISOString().slice(0, 10)

export default function AdminFacilities() {
  const [tab, setTab] = useState('due-soon')
  const [equipment, setEquipment] = useState([])

  useEffect(() => { loadEquipment() }, [])

  function loadEquipment() {
    axios.get('/api/facilities/equipment').then(({ data }) => setEquipment(Array.isArray(data) ? data : [])).catch(console.error)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif text-2xl text-brand-dark">Facilities</h1>
        <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-sans transition-colors ${tab === t.key ? 'bg-brand-green text-white' : 'text-brand-muted hover:text-brand-dark'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'due-soon' && <DueSoonTab />}
      {tab === 'visits' && <VisitsTab equipment={equipment} />}
      {tab === 'equipment' && <EquipmentTab equipment={equipment} onChanged={loadEquipment} />}
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function DueSoonTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/facilities/due-soon').then(({ data }) => setRows(Array.isArray(data) ? data : [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <p className="text-sm text-brand-muted font-sans mb-4">
        Shows the most recent "next due" date logged for each practice / visit type / equipment combination — set it when you log a visit.
      </p>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        {loading ? <Spinner /> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Practice</th>
                <th className="text-left px-3 py-3 font-medium">Type</th>
                <th className="text-left px-3 py-3 font-medium">Equipment</th>
                <th className="text-left px-3 py-3 font-medium">Last visit</th>
                <th className="text-left px-3 py-3 font-medium">Next due</th>
                <th className="text-right px-3 py-3 font-medium">Days</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-sans">{PRACTICE_LABELS[r.practice]}</td>
                  <td className="px-3 py-3 font-sans">{VISIT_TYPE_LABELS[r.visitType]}</td>
                  <td className="px-3 py-3 font-sans text-brand-muted">{r.equipment?.name || '—'}</td>
                  <td className="px-3 py-3 font-sans">{formatDateShort(r.date)}</td>
                  <td className="px-3 py-3 font-sans">{formatDateShort(r.nextDueDate)}</td>
                  <td className="text-right px-3 py-3 font-sans">{r.daysUntilDue}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sans ${DUE_STATUS_STYLES[r.flag]}`}>
                      {DUE_STATUS_LABELS[r.flag]}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loading && (
                <tr><td colSpan={7} className="text-center text-brand-muted py-10 font-sans">Nothing with a next-due date logged yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function VisitsTab({ equipment }) {
  const [practice, setPractice] = useState(PRACTICES[0].slug)
  const [equipmentId, setEquipmentId] = useState('')
  const [visitType, setVisitType] = useState(VISIT_TYPES[0].value)
  const [date, setDate] = useState(todayStr())
  const [contractor, setContractor] = useState('')
  const [notes, setNotes] = useState('')
  const [nextDueDate, setNextDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [history, setHistory] = useState([])
  const [filterPractice, setFilterPractice] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const loadHistory = useCallback(() => {
    const params = {}
    if (filterPractice !== 'all') params.practice = filterPractice
    if (filterType !== 'all') params.visitType = filterType
    axios.get('/api/facilities/visits', { params }).then(({ data }) => setHistory(Array.isArray(data) ? data : [])).catch(console.error)
  }, [filterPractice, filterType])

  useEffect(() => { loadHistory() }, [loadHistory])

  const equipmentForPractice = equipment.filter(e => e.practice === practice && e.active)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await axios.post('/api/facilities/visits', {
        practice, equipmentId: equipmentId || undefined, visitType, date, contractor, notes,
        nextDueDate: nextDueDate || undefined,
      })
      setSuccess('Visit logged.')
      setEquipmentId('')
      setContractor('')
      setNotes('')
      setNextDueDate('')
      loadHistory()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log visit')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Practice</label>
            <select value={practice} onChange={e => { setPractice(e.target.value); setEquipmentId('') }} className="input">
              {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Visit type</label>
            <select value={visitType} onChange={e => setVisitType(e.target.value)} className="input">
              {VISIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Equipment (optional)</label>
            <select value={equipmentId} onChange={e => setEquipmentId(e.target.value)} className="input">
              <option value="">Not tied to specific equipment</option>
              {equipmentForPractice.map(eq => <option key={eq._id} value={eq._id}>{eq.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Date</label>
            <input type="date" value={date} max={todayStr()} onChange={e => setDate(e.target.value)} required className="input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Contractor / company</label>
            <input value={contractor} onChange={e => setContractor(e.target.value)} className="input" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">Next due (optional)</label>
            <input type="date" value={nextDueDate} min={date} onChange={e => setNextDueDate(e.target.value)} className="input" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1">Notes</label>
          <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="input resize-none" placeholder="Optional" />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}

        <button
          type="submit" disabled={saving}
          className="bg-brand-green text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Log visit'}
        </button>
      </form>

      <div className="flex flex-wrap gap-3 mb-4">
        <select value={filterPractice} onChange={e => setFilterPractice(e.target.value)} className="input w-auto text-sm">
          <option value="all">All practices</option>
          {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input w-auto text-sm">
          <option value="all">All types</option>
          {VISIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {history.map(v => (
          <div key={v._id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between text-sm mb-1 font-sans">
              <span className="font-medium text-brand-dark">
                {VISIT_TYPE_LABELS[v.visitType]}{v.equipmentId?.name ? ` — ${v.equipmentId.name}` : ''}
              </span>
              <span className="text-brand-muted">{formatDateShort(v.date)}</span>
            </div>
            <p className="text-xs text-brand-muted font-sans">
              {PRACTICE_LABELS[v.practice]}{v.contractor ? ` · ${v.contractor}` : ''}{v.nextDueDate ? ` · Next due ${formatDateShort(v.nextDueDate)}` : ''}
            </p>
            {v.notes && <p className="text-sm text-brand-muted font-sans mt-1.5">{v.notes}</p>}
          </div>
        ))}
        {history.length === 0 && <p className="text-sm text-brand-muted font-sans">No visits logged yet.</p>}
      </div>
    </div>
  )
}

function EquipmentTab({ equipment, onChanged }) {
  const [showInactive, setShowInactive] = useState(false)
  const [adding, setAdding] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const visible = equipment.filter(e => showInactive || e.active)

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-brand-muted font-sans cursor-pointer">
          <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} className="rounded" />
          Show inactive
        </label>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 bg-brand-green text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-green/90"
        >
          <Plus size={14} /> New equipment
        </button>
      </div>

      {adding && <EquipmentForm onSaved={() => { setAdding(false); onChanged() }} onCancel={() => setAdding(false)} />}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-4">
        {visible.length === 0 ? (
          <p className="text-center text-brand-muted py-10 font-sans text-sm">No equipment recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-muted uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-3 py-3 font-medium">Practice</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Type</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(eq => (
                <Fragment key={eq._id}>
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer ${!eq.active ? 'opacity-50' : ''}`}
                    onClick={() => setExpanded(e => e === eq._id ? null : eq._id)}
                  >
                    <td className="px-4 py-3 font-sans font-medium text-brand-dark">{eq.name}{!eq.active && ' (inactive)'}</td>
                    <td className="px-3 py-3 font-sans text-brand-muted">{PRACTICE_LABELS[eq.practice]}</td>
                    <td className="px-3 py-3 font-sans text-brand-muted hidden md:table-cell">{eq.type || '—'}</td>
                    <td className="px-3 py-3 text-brand-muted">
                      {expanded === eq._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>
                  {expanded === eq._id && (
                    <tr>
                      <td colSpan={4} className="px-5 py-5 bg-gray-50 border-t border-gray-100">
                        <EquipmentForm equipment={eq} onSaved={() => { setExpanded(null); onChanged() }} onCancel={() => setExpanded(null)} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function EquipmentForm({ equipment, onSaved, onCancel }) {
  const [form, setForm] = useState(equipment ? { ...equipment } : {
    name: '', practice: PRACTICES[0].slug, type: '', serialNumber: '', notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      if (equipment) {
        await axios.patch(`/api/facilities/equipment/${equipment._id}`, form)
      } else {
        await axios.post('/api/facilities/equipment', form)
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
      await axios.patch(`/api/facilities/equipment/${equipment._id}`, { active: !equipment.active })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4" onClick={e => e.stopPropagation()}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input value={form.name} onChange={e => set('name', e.target.value)} className="input" placeholder="e.g. Autoclave 1" />
        </Field>
        <Field label="Practice">
          <select value={form.practice} onChange={e => set('practice', e.target.value)} className="input">
            {PRACTICES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Type">
          <input value={form.type || ''} onChange={e => set('type', e.target.value)} className="input" placeholder="e.g. Autoclave, Scaler, Dental Chair" />
        </Field>
        <Field label="Serial number">
          <input value={form.serialNumber || ''} onChange={e => set('serialNumber', e.target.value)} className="input" />
        </Field>
      </div>
      <Field label="Notes">
        <textarea rows={2} value={form.notes || ''} onChange={e => set('notes', e.target.value)} className="input resize-none" />
      </Field>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={save} disabled={saving || !form.name.trim()} className="bg-brand-green text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-brand-green/90 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-brand-muted hover:border-gray-400">
            Cancel
          </button>
        </div>
        {equipment && (
          <button onClick={toggleActive} disabled={saving} className="text-sm text-red-500 hover:text-red-700">
            {equipment.active ? 'Deactivate' : 'Reactivate'}
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
