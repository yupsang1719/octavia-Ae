import { useState } from 'react'
import axios from 'axios'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

function StarRow({ size = 16, color = '#C8A96E' }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

function EmailPreview({ form }) {
  const firstName = form.name ? form.name.split(' ')[0] : 'there'
  const treatmentRef = form.treatment ? ` after your ${form.treatment}` : ''
  const sigName = form.clinician ? `${form.clinician} & the Octavia Dental team` : 'The Octavia Dental team'

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f0f2f0', padding: '24px 16px', borderRadius: 12, minHeight: 400 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ background: '#fff', borderRadius: '10px 10px 0 0', padding: '16px 24px', borderBottom: '1px solid #eef2eb', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/images/icon-192.png" alt="" width={32} height={32} style={{ borderRadius: 7 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2D5A1E', lineHeight: 1.2 }}>Octavia Dental & Facial Aesthetics</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>Godalming, Surrey</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ background: '#fff', padding: '28px 24px 24px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#2D5A1E', marginBottom: 6 }}>Hi {firstName},</div>

          {(form.treatment || form.visitDate) && (
            <div style={{ display: 'inline-block', background: '#edf7e3', color: '#2D5A1E', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100, marginBottom: 16, border: '1px solid #c3e6a0' }}>
              {[form.treatment, form.visitDate].filter(Boolean).join(' · ')}
            </div>
          )}

          <p style={{ fontSize: 14, color: '#2a2a2a', lineHeight: 1.75, margin: '0 0 12px' }}>
            Thank you so much for coming in to see us — it was genuinely lovely to look after you.
            We hope you're feeling great and that you're already noticing the difference{treatmentRef}.
          </p>

          {(form.treatment || form.visitDate || form.clinician) && (
            <div style={{ background: '#f7faf4', border: '1px solid #d4eabd', borderLeft: '4px solid #6AAF30', borderRadius: 8, padding: '14px 16px', margin: '16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
              {form.treatment && <div><div style={{ fontSize: 9, fontWeight: 700, color: '#6AAF30', textTransform: 'uppercase', letterSpacing: 1 }}>Treatment</div><div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a10', marginTop: 2 }}>{form.treatment}</div></div>}
              {form.visitDate && <div><div style={{ fontSize: 9, fontWeight: 700, color: '#6AAF30', textTransform: 'uppercase', letterSpacing: 1 }}>Date</div><div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a10', marginTop: 2 }}>{form.visitDate}</div></div>}
              {form.clinician && <div><div style={{ fontSize: 9, fontWeight: 700, color: '#6AAF30', textTransform: 'uppercase', letterSpacing: 1 }}>Clinician</div><div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a10', marginTop: 2 }}>{form.clinician}</div></div>}
              <div><div style={{ fontSize: 9, fontWeight: 700, color: '#6AAF30', textTransform: 'uppercase', letterSpacing: 1 }}>Location</div><div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a10', marginTop: 2 }}>Godalming, Surrey</div></div>
            </div>
          )}

          {form.note && (
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, margin: '0 0 12px', fontStyle: 'italic', borderLeft: '3px solid #6AAF30', paddingLeft: 12 }}>
              {form.note}
            </p>
          )}

          <p style={{ fontSize: 14, color: '#2a2a2a', lineHeight: 1.75, margin: '0 0 20px' }}>
            As a small independent practice, every review genuinely helps other patients find us. If you have just one minute, we'd be so grateful if you could share your experience on Google.
          </p>

          {/* CTA */}
          <div style={{ textAlign: 'center', margin: '0 0 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>Leave us a Google review</div>
            <div style={{ marginBottom: 14 }}><StarRow size={26} /></div>
            <div style={{ display: 'inline-block', background: '#2D5A1E', color: '#fff', padding: '13px 32px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
              Leave a Google review ★
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#999' }}>Takes less than a minute · Opens Google directly</div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eef2eb', margin: '0 0 20px' }} />

          <p style={{ fontSize: 13, color: '#444', lineHeight: 1.75, margin: '0 0 20px' }}>
            If anything about your visit could have been better, please reply to this email or call us on <strong style={{ color: '#2D5A1E' }}>01483 958205</strong> — we always want to know.
          </p>

          {/* Signature */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f7faf4', borderRadius: 8, border: '1px solid #e0efd3' }}>
            <div style={{ width: 40, height: 40, background: '#2D5A1E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>OD</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2D5A1E' }}>{sigName}</div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>Octavia Dental & Facial Aesthetics · 01483 958205</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#2D5A1E', borderRadius: '0 0 10px 10px', padding: '18px 24px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 2 }}>
            01483 958205 · info@octavia-dental.co.uk · octavia-dental.co.uk
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminReviewRequest() {
  const [form, setForm] = useState({
    name: '', email: '', treatment: '', visitDate: '', clinician: '', note: '',
  })
  const [status, setStatus]     = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [lastEmail, setLastEmail] = useState('')

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSend(e) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      await axios.post('/api/admin/review-request', form)
      setLastEmail(form.email)
      setForm({ name: '', email: '', treatment: '', visitDate: '', clinician: '', note: '' })
      setStatus('ok')
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message)
      setStatus('error')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-brand-dark font-medium">Review Requests</h1>
        <p className="font-sans text-sm text-brand-muted mt-1">
          Send a personalised Google review request to a patient after their visit.
        </p>
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">

        {/* ── FORM ── */}
        <div>
          {status === 'ok' && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3.5 mb-4">
              <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
              <p className="font-sans text-sm text-green-800">
                Sent to <strong>{lastEmail}</strong>.
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3.5 mb-4">
              <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
              <p className="font-sans text-sm text-red-800">Failed: {errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSend} className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <div className="p-5 space-y-4">
              <p className="font-sans text-xs font-semibold text-brand-dark uppercase tracking-wide">Patient</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans text-xs text-brand-muted mb-1.5">Name <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="Sarah Mitchell" value={form.name} onChange={set('name')} className="input" />
                </div>
                <div>
                  <label className="block font-sans text-xs text-brand-muted mb-1.5">Email <span className="text-red-500">*</span></label>
                  <input type="email" required placeholder="sarah@example.com" value={form.email} onChange={set('email')} className="input" />
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="font-sans text-xs font-semibold text-brand-dark uppercase tracking-wide">
                Visit details <span className="text-gray-400 font-normal normal-case tracking-normal">(shown in email)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans text-xs text-brand-muted mb-1.5">Treatment</label>
                  <input type="text" placeholder="Air Flow Hygiene" value={form.treatment} onChange={set('treatment')} className="input" />
                </div>
                <div>
                  <label className="block font-sans text-xs text-brand-muted mb-1.5">Date of visit</label>
                  <input type="text" placeholder="16 June 2026" value={form.visitDate} onChange={set('visitDate')} className="input" />
                </div>
              </div>
              <div>
                <label className="block font-sans text-xs text-brand-muted mb-1.5">Clinician</label>
                <input type="text" placeholder="Dr Rachayita Pant" value={form.clinician} onChange={set('clinician')} className="input" />
              </div>
            </div>

            <div className="p-5 space-y-2">
              <p className="font-sans text-xs font-semibold text-brand-dark uppercase tracking-wide">
                Personal note <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
              </p>
              <textarea rows={3} placeholder="e.g. It was lovely seeing you today — we hope you're already loving the results!"
                value={form.note} onChange={set('note')} className="input resize-none" />
            </div>

            <div className="px-5 py-4 bg-gray-50 rounded-b-xl">
              <button type="submit" disabled={status === 'sending'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green text-white font-sans text-sm font-medium rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                <Send size={14} />
                {status === 'sending' ? 'Sending…' : 'Send Review Request'}
              </button>
            </div>
          </form>
        </div>

        {/* ── PREVIEW ── */}
        <div className="lg:sticky lg:top-20">
          <p className="font-sans text-xs font-semibold text-brand-muted uppercase tracking-wide mb-3">Live Preview</p>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <EmailPreview form={form} />
          </div>
        </div>

      </div>
    </div>
  )
}
