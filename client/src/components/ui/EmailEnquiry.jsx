import { useState } from 'react'
import { ArrowRight, Check, Copy, ExternalLink, X } from 'lucide-react'
import { usePractice } from '../../contexts/PracticeContext'

const BOOKING_BODY = 'Name:\nPhone:\nPreferred day / time:\nNew or existing patient:\n\n'

const SUBJECTS = [
  { label: 'Book an appointment', hint: 'New and existing patients.',            subject: 'Appointment request',  body: BOOKING_BODY },
  { label: 'Treatment question',  hint: 'Ask about a treatment or prices.',      subject: 'Treatment enquiry' },
  { label: 'Existing patient',    hint: 'Appointments, records or payments.',     subject: 'Existing patient enquiry' },
  { label: 'Something else',      hint: 'Feedback, a question or simply hello.',  subject: 'General enquiry' },
]

const enc = encodeURIComponent

function mailtoHref(email, subject = '', body = '') {
  const params = []
  if (subject) params.push(`subject=${enc(subject)}`)
  if (body)    params.push(`body=${enc(body)}`)
  return `mailto:${email}${params.length ? `?${params.join('&')}` : ''}`
}

// Web-mail compose links — the fallback when no desktop mail app handles mailto:
const gmailHref   = (email, s, b) => `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(email)}&su=${enc(s)}&body=${enc(b)}`
const outlookHref = (email, s, b) => `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(email)}&subject=${enc(s)}&body=${enc(b)}`

/**
 * Email-first enquiry block: big address, "Write to us" / "Copy address",
 * then a list of subjects that open the visitor's mail app pre-filled.
 * After any click a small panel offers Gmail / Outlook / copy, because many
 * visitors have no desktop mail app and mailto: then silently does nothing.
 * `treatment` (optional) adds a treatment-specific subject at the top.
 */
export default function EmailEnquiry({ treatment = '', compact = false }) {
  const { email } = usePractice()
  const [copied, setCopied] = useState(false)
  const [chosen, setChosen] = useState(null) // { subject, body } of the last clicked link

  if (!email) return null

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const el = document.createElement('textarea')
      el.value = email
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      el.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const subjects = treatment
    ? [{ label: treatment, hint: 'Book or ask about this treatment.', subject: `${treatment} enquiry`, body: BOOKING_BODY }, ...SUBJECTS]
    : SUBJECTS

  const pick = (subject = 'Enquiry', body = '') => () => setChosen({ subject, body })

  const webBtn = 'inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-dark bg-white border border-brand-border rounded-full px-3.5 py-2 hover:border-brand-green hover:text-brand-green transition-colors'

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-brand-muted font-semibold mb-3">Email</p>
      <a
        href={mailtoHref(email, 'Enquiry')}
        onClick={pick()}
        className={`block font-display text-brand-dark hover:text-brand-green transition-colors break-all leading-tight ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}
      >
        {email}
      </a>

      <div className="flex flex-wrap gap-3 mt-5">
        <a href={mailtoHref(email, 'Enquiry')} onClick={pick()} className="btn-primary text-sm inline-flex items-center gap-2">
          Write to us <ArrowRight className="w-4 h-4" />
        </a>
        <button type="button" onClick={copy} className="btn-secondary text-sm inline-flex items-center gap-2" aria-live="polite">
          {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy address</>}
        </button>
      </div>

      <p className={`font-sans text-xs uppercase tracking-widest text-brand-muted font-semibold ${compact ? 'mt-6' : 'mt-10'} mb-1`}>
        Or choose a subject
      </p>
      <ul className="divide-y divide-brand-border border-y border-brand-border">
        {subjects.map(s => (
          <li key={s.label}>
            <a
              href={mailtoHref(email, s.subject, s.body)}
              onClick={pick(s.subject, s.body)}
              className={`group grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,14rem)_1fr_auto] items-center gap-x-6 gap-y-1 ${compact ? 'py-3' : 'py-4'}`}
            >
              <span className="font-serif text-lg text-brand-dark group-hover:text-brand-green transition-colors">{s.label}</span>
              <span className="hidden sm:block font-sans text-sm text-brand-muted">{s.hint}</span>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
            </a>
          </li>
        ))}
      </ul>

      {chosen && (
        <div role="status" className="mt-4 bg-brand-cream border border-brand-border rounded-xl p-4 relative">
          <button type="button" onClick={() => setChosen(null)} className="absolute top-3 right-3 text-brand-muted hover:text-brand-dark" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
          <p className="font-sans text-sm text-brand-dark pr-6">
            Your email app should open now. <span className="text-brand-muted">Nothing happened? Write to us with:</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href={gmailHref(email, chosen.subject, chosen.body)} target="_blank" rel="noopener noreferrer" className={webBtn}>
              Gmail <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href={outlookHref(email, chosen.subject, chosen.body)} target="_blank" rel="noopener noreferrer" className={webBtn}>
              Outlook <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button type="button" onClick={copy} className={webBtn}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy address</>}
            </button>
          </div>
        </div>
      )}

      <p className="font-sans text-xs text-brand-subtle mt-4">
        We use the details you send us only to reply to you. See our{' '}
        <a href="/privacy-policy" className="underline hover:text-brand-green">privacy policy</a>.
      </p>
    </div>
  )
}
