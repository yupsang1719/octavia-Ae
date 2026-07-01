import { useEffect, useState } from 'react'
import axios from 'axios'
import { RefreshCw, Send, CheckCircle, AlertCircle, Users, Search, X, Calendar, Clock, ChevronRight } from 'lucide-react'

// ── Merge tag substitution (client-side preview) ──────────────────────────────
function substitute(text, vars) {
  if (!text) return ''
  return text
    .replace(/\{\{firstName\}\}/g, vars.firstName || '')
    .replace(/\{\{name\}\}/g,      vars.name      || '')
    .replace(/\{\{treatment\}\}/g, vars.treatment  || '')
    .replace(/\{\{clinician\}\}/g, vars.clinician  || '')
    .replace(/\{\{practiceName\}\}/g, 'Octavia Dental & Facial Aesthetics')
    .replace(/\{\{phone\}\}/g, '01483 958205')
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Individual send panel ─────────────────────────────────────────────────────
function PatientPanel({ patient, templates, onClose, onSent }) {
  const [appointments, setAppointments] = useState(null)
  const [loadingAppts, setLoadingAppts] = useState(true)
  const [templateId, setTemplateId]     = useState(templates[0]?._id || '')
  const [vars, setVars]                 = useState({
    treatment: patient.lastTreatment || '',
    clinician: patient.lastClinician || '',
    note: '',
  })
  const [sending, setSending]           = useState(false)
  const [sent, setSent]                 = useState(false)
  const [error, setError]               = useState('')

  const template = templates.find(t => t._id === templateId)
  const firstName = (patient.name || '').split(' ')[0]
  const mergeVars = { firstName, name: patient.name, ...vars }

  useEffect(() => {
    setLoadingAppts(true)
    axios.get(`/api/dentally/patients/${patient.id}/appointments`)
      .then(({ data }) => {
        setAppointments(data)
        // Pre-fill from last appointment
        const last = data.past?.[0]
        if (last) {
          setVars(v => ({
            ...v,
            treatment: last.treatment || '',
            clinician: last.clinician || '',
          }))
        }
      })
      .catch(() => setAppointments({ past: [], upcoming: [] }))
      .finally(() => setLoadingAppts(false))
  }, [patient.id])

  async function send() {
    setSending(true)
    setError('')
    try {
      await axios.post('/api/dentally/send-single', { patient, templateId, vars })
      setSent(true)
      setTimeout(() => { onSent(); onClose() }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send.')
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-4xl bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl text-brand-dark font-medium">{patient.name}</h2>
            <p className="text-sm text-brand-muted font-sans">{patient.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-brand-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">

          {/* Left — appointments + send controls */}
          <div className="w-96 flex-shrink-0 border-r border-gray-200 overflow-y-auto flex flex-col">
            <div className="p-5 flex-1 space-y-5">

              {/* Appointments */}
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-widest font-sans mb-3">Appointments</p>
                {loadingAppts ? (
                  <div className="flex items-center gap-2 text-sm text-brand-muted font-sans">
                    <div className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                    Loading…
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments?.past?.length > 0 && (
                      <div>
                        <p className="text-xs text-brand-subtle font-sans mb-1.5">Past visits</p>
                        {appointments.past.slice(0, 5).map(a => (
                          <div key={a.id} className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm font-sans border border-gray-100">
                            <div className="font-medium text-brand-dark">{a.treatment || 'Appointment'}</div>
                            <div className="text-brand-muted text-xs mt-0.5 flex items-center gap-3">
                              <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(a.date)}</span>
                              {a.clinician && <span>{a.clinician}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {appointments?.upcoming?.length > 0 && (
                      <div>
                        <p className="text-xs text-brand-subtle font-sans mb-1.5">Upcoming</p>
                        {appointments.upcoming.slice(0, 5).map(a => (
                          <div key={a.id} className="bg-brand-green/5 rounded-lg px-3 py-2.5 text-sm font-sans border border-brand-green/20">
                            <div className="font-medium text-brand-dark">{a.treatment || 'Appointment'}</div>
                            <div className="text-brand-muted text-xs mt-0.5 flex items-center gap-3">
                              <span className="flex items-center gap-1"><Clock size={10} />{formatDate(a.date)}</span>
                              {a.clinician && <span>{a.clinician}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {!appointments?.past?.length && !appointments?.upcoming?.length && (
                      <p className="text-sm text-brand-subtle font-sans">No appointments found.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Template + vars */}
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-widest font-sans mb-3">Email</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-brand-muted font-sans mb-1">Template</label>
                    <select
                      value={templateId}
                      onChange={e => setTemplateId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-muted font-sans mb-1">Treatment</label>
                    <input
                      value={vars.treatment}
                      onChange={e => setVars(v => ({ ...v, treatment: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                      placeholder="e.g. Air Flow Hygiene"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-muted font-sans mb-1">Clinician</label>
                    <input
                      value={vars.clinician}
                      onChange={e => setVars(v => ({ ...v, clinician: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                      placeholder="e.g. Dr Rachayita Pant"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-muted font-sans mb-1">Personal note <span className="text-brand-subtle">(optional)</span></label>
                    <textarea
                      value={vars.note}
                      onChange={e => setVars(v => ({ ...v, note: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                      placeholder="e.g. It was lovely seeing you today!"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Send footer */}
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              {error && <p className="text-xs text-red-600 font-sans mb-2">{error}</p>}
              {sent ? (
                <div className="flex items-center gap-2 text-sm text-green-700 font-sans font-medium">
                  <CheckCircle size={15} /> Sent successfully
                </div>
              ) : (
                <button
                  onClick={send}
                  disabled={sending || !templateId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-green text-white text-sm font-sans font-medium rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                  {sending ? 'Sending…' : `Send to ${patient.name.split(' ')[0]}`}
                </button>
              )}
            </div>
          </div>

          {/* Right — live preview */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-5">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-widest font-sans mb-3">Live preview</p>
              {template ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Email header */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                    <div className="w-7 h-7 rounded-lg bg-brand-green flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">OD</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-dark font-sans">Octavia Dental & Facial Aesthetics</p>
                      <p className="text-xs text-brand-subtle font-sans">Godalming, Surrey</p>
                    </div>
                  </div>
                  {/* Subject */}
                  <div className="px-5 py-3 border-b border-gray-100 bg-white">
                    <p className="text-xs text-brand-subtle font-sans">Subject:</p>
                    <p className="text-sm font-medium text-brand-dark font-sans mt-0.5">{substitute(template.subject, mergeVars)}</p>
                  </div>
                  {/* Body */}
                  <div className="px-5 py-5">
                    <p className="text-base font-semibold text-brand-green font-sans mb-4">Hi {firstName},</p>
                    <div
                      className="blog-body text-sm"
                      dangerouslySetInnerHTML={{ __html: substitute(template.bodyHtml, mergeVars) }}
                    />
                    {template.type === 'review_request' && (
                      <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-brand-subtle font-sans mb-2">★★★★★</p>
                        <div className="inline-block bg-brand-green text-white text-xs font-medium px-4 py-2 rounded-lg">
                          Leave a Google review ★
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Footer */}
                  <div className="px-5 py-3 bg-brand-green">
                    <p className="text-xs text-white/70 font-sans">01483 958205 · info@octavia-dental.co.uk · octavia-dental.co.uk</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-brand-muted font-sans">Select a template to preview.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminPatients() {
  const [patients, setPatients]       = useState([])
  const [templates, setTemplates]     = useState([])
  const [loading, setLoading]         = useState(false)
  const [configured, setConfigured]   = useState(true)
  const [selected, setSelected]       = useState(new Set())
  const [templateId, setTemplateId]   = useState('')
  const [sending, setSending]         = useState(false)
  const [result, setResult]           = useState(null)
  const [search, setSearch]           = useState('')
  const [consentOnly, setConsentOnly] = useState(false)
  const [error, setError]             = useState('')
  const [activePatient, setActivePatient] = useState(null)

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

  async function bulkSend() {
    if (!templateId || !selected.size) return
    setSending(true)
    setResult(null)
    try {
      const chosen = patients.filter(p => selected.has(p.id))
      const { data } = await axios.post('/api/dentally/send', { patients: chosen, templateId })
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
    const matchSearch  = !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    const matchConsent = !consentOnly || p.marketingConsent
    return matchSearch && matchConsent
  })

  const allSelected    = filtered.length > 0 && filtered.every(p => selected.has(p.id))
  const selectedTemplate = templates.find(t => t._id === templateId)

  return (
    <div>
      {activePatient && (
        <PatientPanel
          patient={activePatient}
          templates={templates}
          onClose={() => setActivePatient(null)}
          onSent={() => setResult({ sent: [activePatient.email], failed: [] })}
        />
      )}

      <div className="mb-6">
        <h1 className="font-serif text-2xl text-brand-dark">Patients</h1>
        <p className="text-sm text-brand-muted font-sans mt-0.5">
          Patients who visited in the last 30 days. Click a patient to preview and send individually, or select multiple for bulk send.
        </p>
      </div>

      {!configured && (
        <div className="mb-5 px-4 py-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 font-sans">
          <strong>Dentally not configured.</strong> Add <code className="bg-amber-100 px-1 rounded">DENTALLY_API_KEY</code> to your server environment variables.
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-sans">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="mb-5 px-4 py-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-sans">
          <div className="flex items-center gap-2 font-medium mb-1"><CheckCircle size={15} /> Sent</div>
          <p>{result.sent.length} sent successfully{result.failed?.length ? `, ${result.failed.length} failed` : ''}.</p>
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
          {patients.length ? 'Refresh' : 'Load last 30 days'}
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
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-sans text-brand-muted">
              <input
                type="checkbox"
                checked={consentOnly}
                onChange={e => setConsentOnly(e.target.checked)}
                className="rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
              />
              Marketing consent only
            </label>

            {/* Bulk send controls — only show when patients selected */}
            {selected.size > 0 && (
              <div className="ml-auto flex items-center gap-3">
                <select
                  value={templateId}
                  onChange={e => setTemplateId(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <button
                  onClick={bulkSend}
                  disabled={sending}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white text-sm font-sans font-medium rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                  {sending ? 'Sending…' : `Bulk send to ${selected.size}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedTemplate && selected.size > 0 && (
        <div className="mb-3 px-3 py-2 bg-brand-green/5 border border-brand-green/20 rounded-lg text-xs font-sans text-brand-green">
          Will send "<strong>{selectedTemplate.name}</strong>" to {selected.size} patient{selected.size !== 1 ? 's' : ''} without preview.
          {selectedTemplate.type === 'review_request' && ' Includes Google review button.'}
        </div>
      )}

      {/* Patient table */}
      {patients.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <Users size={14} className="text-brand-muted" />
            <span className="text-xs font-sans text-brand-muted">
              {filtered.length} patient{filtered.length !== 1 ? 's' : ''}
              {selected.size > 0 && ` · ${selected.size} selected for bulk send`}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 text-xs text-brand-muted uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left w-8">
                  <input type="checkbox" checked={allSelected} onChange={() => toggleAll(filtered)}
                    className="rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer" />
                </th>
                <th className="px-3 py-3 text-left font-medium">Name</th>
                <th className="px-3 py-3 text-left font-medium hidden sm:table-cell">Email</th>
                <th className="px-3 py-3 text-left font-medium hidden md:table-cell">Last visit</th>
                <th className="px-3 py-3 text-left font-medium hidden lg:table-cell">Consent</th>
                <th className="px-3 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className={`transition-colors ${selected.has(p.id) ? 'bg-brand-green/5' : 'hover:bg-gray-50'}`}>
                  <td className="px-5 py-3" onClick={e => { e.stopPropagation(); toggle(p.id) }}>
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)}
                      className="rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer" />
                  </td>
                  <td className="px-3 py-3 font-sans font-medium text-brand-dark">{p.name}</td>
                  <td className="px-3 py-3 text-brand-muted font-sans hidden sm:table-cell">{p.email}</td>
                  <td className="px-3 py-3 text-brand-muted font-sans hidden md:table-cell">{formatDate(p.lastVisit) || '—'}</td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    {p.marketingConsent
                      ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium font-sans">Yes</span>
                      : <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium font-sans">No</span>}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => setActivePatient(p)}
                      className="flex items-center gap-1 text-xs font-sans text-brand-green hover:text-brand-green/80 transition-colors whitespace-nowrap"
                    >
                      Send <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && patients.length === 0 && configured && (
        <div className="text-center py-16 text-brand-muted font-sans text-sm">
          Click "Load patients from Dentally" to fetch patients.
        </div>
      )}
    </div>
  )
}
