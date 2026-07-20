export const CENTRAL_PRACTICE = 'octavia-house'

export const PRACTICES = [
  { slug: 'octavia-house',     label: 'Octavia House (Central)' },
  { slug: 'octavia-aesthetic', label: 'Octavia Dental (Godalming)' },
  { slug: 'new-octavia',       label: 'New Octavia (Hindhead)' },
]

export const PRACTICE_LABELS = Object.fromEntries(PRACTICES.map(p => [p.slug, p.label]))

export const ITEM_CATEGORIES = [
  'Anaesthetics',
  'Restorative',
  'Impressions',
  'Endodontics',
  'Hygiene & Prevention',
  'Infection Control & PPE',
  'Surgical & Sundries',
  'Surgical & Implants',
  'Whitening & Aesthetics',
  'Facial Aesthetics',
]

export const ITEM_SUPPLIERS = ['Hague Dental Supplies', 'Henry Schein Dental', 'Other']

export const COUNT_TIERS = ['weekly', 'monthly']

export const USAGE_REASONS = [
  { value: 'used',    label: 'Used' },
  { value: 'wasted',  label: 'Wasted' },
  { value: 'expired', label: 'Expired' },
  { value: 'damaged', label: 'Damaged' },
]

export const STATUS_STYLES = {
  ORDER_NOW: 'bg-red-100 text-red-700',
  LOW:       'bg-amber-100 text-amber-700',
  OK:        'bg-green-100 text-green-700',
}

export const BATCH_REQUIRED_CATEGORIES = ['Anaesthetics', 'Facial Aesthetics', 'Endodontics']
