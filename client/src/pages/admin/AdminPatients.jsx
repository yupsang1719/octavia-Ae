import { useEffect, useState } from 'react'
import axios from 'axios'
import { RefreshCw, Send, CheckCircle, AlertCircle, Users, Search } from 'lucide-react'

export default function AdminPatients() {
  const [patients, setPatients]     = useState([])
  const [templates, setTemplates]   = useState([])
  const [loading, setLoading]       = useState(false)
  const [configured, setConfigured] = useState(true)
  const [selected, setSelected]     = useState(new Set())
  const [templateId, setTemplateId] = useState('')
  const [sending, setSending]       = useState(false)
  const [result, setResult]         = useState(null)
  const [search, setSearch]         = useState('')
  const [error, setError]           = useState('')

  useEffect(() => {
    axios.get('/api/email-templates').then(({ data }) => {
      setTemplates(data)
      if (data.length) setTemplateId(data[0]._id)
    }).catch(() => {})
  }, [])

  async function loadPatients() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await axios.get('/api/dentally/patients')
      setConfigured(data.configured !== false)
      setPatients(data.patients || [])
      setSelected(new Set())
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load patients.')
    } finally {
      setLoading(false)
    }
  }

  function toggleAll(filtered) {
    if (filtered.every(p => selected.has(p.id))) {
      setSelected(prev => { const s = new Set(prev); filtered.forEach(p => s.delete(p.id)); return s })
    } else {
      setSelected(prev => { const s = new Set(prev); filtered.forEach(p => s.add(p.id)); return s })
    }
  }

  function toggle(id) {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  async function send() {
    if (!templateId || !selected.size) return
    setSending(true)
    setResult(null)
    try {
      const chosen = patients.filter(p => selected.has(p.id))
      const { data } = await axios.post('/api/dentally/send', {
        patients:   chosen,
        templateId,
      })
      setResult(data)
      setSelected(new Set())
    } catch (err) {
      setError(err.response?.data?.error || 'Send failed.')
    } finally {
      setSending(false)
    }
  }

  const filtered = patients.filter(p => {
    const q = search.toLowerCase()
    return !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
  })

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id))
  const selectedTemplate = templates.find(t => t._id === templateId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-brand-dark">Patients — Marketing Consent</h1>
        <p className="text-sm text-brand-muted font-sans mt-0.5">
          Patients from Dentally who have ticked marketing consent. Select patients and send an email template.
        </p>
      </div>

      {!configured && (
        <div className="mb-5 px-4 py-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 font-sans">
          <strong>Dentally not configured.</strong> Add <code className="bg-amber-100 px-1 rounded">DENTALLY_API_KEY</code> to your server environment variables to sync patients.
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-sans">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="mb-5 px-4 py-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-sans">
          <div className="flex items-center gap-2 font-medium mb-1">
            <CheckCircle size={15} /> Emails sent
          </div>
          <p>{result.sent.length} sent successfully{result.failed.length ? `, ${result.failed.length} failed` : ''}.</p>
          {result.failed.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-red-700">
              {result.failed.map(f => <li key={f.email}>{f.email}: {f.error}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={loadPatients}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-sans text-brand-dark hover:border-brand-green transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {patients.length ? 'Refresh' : 'Load patients from Dentally'}
        </button>

        {patients.length > 0 && (
          <>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-subtle" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name or email…"
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent w-52"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <select
                value={templateId}
                onChange={e => setTemplateId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              >
                {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>

              <button
                onClick={send}
                disabled={sending || !selected.size || !templateId}
                className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white text-sm font-sans font-medium rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50"
              >
                <Send size={14} />
                {sending ? 'Sending…' : `Send to ${selected.size || 0} patient${selected.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          </>
        )}
      </div>

      {selectedTemplate && selected.size > 0 && (
        <div className="mb-3 px-3 py-2 bg-brand-green/5 border border-brand-green/20 rounded-lg text-xs font-sans text-brand-green">
          Will send "<strong>{selectedTemplate.name}</strong>" to {selected.size} patient{selected.size !== 1 ? 's' : ''}.
          {selectedTemplate.type === 'review_request' && ' Includes Google review button.'}
        </div>
      )}

      {/* Patient table */}
      {patients.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <Users size={14} className="text-brand-muted" />
            <span className="text-xs font-sans text-brand-muted">
              {filtered.length} patient{filtered.length !== 1 ? 's' : ''} with marketing consent
              {selected.size > 0 && ` · ${selected.size} selected`}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 text-xs text-brand-muted uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => toggleAll(filtered)}
                    className="rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
                  />
                </th>
                <th className="px-3 py-3 text-left font-medium">Name</th>
                <th className="px-3 py-3 text-left font-medium hidden sm:table-cell">Email</th>
                <th className="px-3 py-3 text-left font-medium hidden md:table-cell">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`cursor-pointer transition-colors ${selected.has(p.id) ? 'bg-brand-green/5' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-5 py-3" onClick={e => { e.stopPropagation(); toggle(p.id) }}>
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggle(p.id)}
                      className="rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-3 font-sans font-medium text-brand-dark">{p.name}</td>
                  <td className="px-3 py-3 text-brand-muted font-sans hidden sm:table-cell">{p.email}</td>
                  <td className="px-3 py-3 text-brand-muted font-sans hidden md:table-cell">{p.phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && patients.length === 0 && configured && (
        <div className="text-center py-16 text-brand-muted font-sans text-sm">
          Click "Load patients from Dentally" to fetch patients with marketing consent.
        </div>
      )}
    </div>
  )
}
