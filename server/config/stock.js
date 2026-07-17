export const CENTRAL_PRACTICE = 'octavia-house'

export const PRACTICE_SLUGS = ['octavia-house', 'octavia-aesthetic', 'new-octavia']

export const TRANSFER_DESTINATIONS = PRACTICE_SLUGS.filter(p => p !== CENTRAL_PRACTICE)

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

// Categories where goods-in requires batchNo + expiryDate (warn-but-allow for others)
export const BATCH_REQUIRED_CATEGORIES = ['Anaesthetics', 'Facial Aesthetics', 'Endodontics']

export const MOVEMENT_TYPES = ['goods_in', 'transfer', 'usage', 'adjustment']

export const MOVEMENT_REASONS = ['used', 'wasted', 'expired', 'damaged', 'count_adjustment']

export const COUNT_TIERS = ['weekly', 'monthly']
