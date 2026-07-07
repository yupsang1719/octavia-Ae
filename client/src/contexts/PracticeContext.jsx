import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULTS = {
  name:          'Octavia Dental & Facial Aesthetics',
  phone:         '01483 958205',
  phoneTel:      '01483958205',
  email:         'info@octavia-dental.co.uk',
  address:       'Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ',
  whatsapp:      '447584965468',
  instagram:     'https://instagram.com/octaviadental',
  googleMapsUrl: 'https://maps.google.com/?q=Octavia+Dental+Godalming',
  tagline:       'Private dental care & facial aesthetics in Godalming, Surrey.',
  type:          'private',
  metaTitle:     'Octavia Dental & Facial Aesthetics | Godalming, Surrey',
  metaDesc:      'Private dental care and facial aesthetics in Godalming, Surrey.',
  hours:         [],
}

const PracticeContext = createContext(DEFAULTS)

export function PracticeProvider({ children }) {
  const [practice, setPractice] = useState(DEFAULTS)

  useEffect(() => {
    fetch('/api/practice')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        // Normalise phone for tel: links (strip spaces/dashes)
        const phoneTel = (data.phone || '').replace(/\s+/g, '')
        setPractice({ ...DEFAULTS, ...data, phoneTel })
      })
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
