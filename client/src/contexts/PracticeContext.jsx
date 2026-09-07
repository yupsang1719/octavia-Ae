import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULTS = {
  slug:             'octavia-aesthetic',
  name:             'Octavia Dental & Facial Aesthetics',
  phone:            '01483 958205',
  phoneTel:         '01483958205',
  email:            'info@octavia-dental.co.uk',
  address:          'Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ',
  whatsapp:         '447584965468',
  instagram:        'https://instagram.com/octaviadental',
  googleMapsUrl:    'https://maps.google.com/?q=Octavia+Dental+Godalming',
  tagline:          'Private dental care & facial aesthetics in Godalming, Surrey.',
  type:             'private',
  freeConsultation: true,
  bookingLabel:     'Book free consultation',
  metaTitle:        'Octavia Dental & Facial Aesthetics | Godalming, Surrey',
  metaDesc:         'Private dental care and facial aesthetics in Godalming, Surrey.',
  hours:            [],
}

const PracticeContext = createContext(DEFAULTS)

function derive(data) {
  const phoneTel = (data.phone || '').replace(/\s+/g, '')
  const isPrivate = data.type === 'private'
  const freeConsultation = data.freeConsultation !== false
  const bookingLabel = (isPrivate && freeConsultation) ? 'Book free consultation' : 'Request appointment'
  return { ...DEFAULTS, ...data, phoneTel, freeConsultation, bookingLabel }
}

// In production the server already knows which domain was requested and
// stamps the right practice's data into the page before it's sent (see
// server/app.js). So there's usually nothing to fetch here at all — this
// is only a fallback for local dev (vite serves index.html unstamped).
const injected = typeof window !== 'undefined' ? window.__PRACTICE__ : null

export function PracticeProvider({ children }) {
  const [practice, setPractice] = useState(injected ? derive(injected) : DEFAULTS)

  // Apply practice theme to <html> so CSS variable overrides take effect
  useEffect(() => {
    if (practice.slug) {
      document.documentElement.dataset.practice = practice.slug
    }
  }, [practice.slug])

  useEffect(() => {
    if (injected) return
    fetch('/api/practice')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPractice(derive(data)) })
      .catch(() => {})
  }, [])

  return (
    <PracticeContext.Provider value={practice}>
      {children}
    </PracticeContext.Provider>
  )
}

export function usePractice() {
  return useContext(PracticeContext)
}
