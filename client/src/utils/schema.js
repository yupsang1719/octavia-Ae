import { SITE_URL, SITE_NAME, PRACTICE } from './seo'

// Everything here describes the practice whose domain is being viewed — one
// build serves all three, so nothing practice-specific may be hardcoded.

// Per-practice facts not stored in the Practice model. Coordinates are the
// postcode centroids from postcodes.io.
const EXTRAS = {
  'octavia-aesthetic': {
    geo: [51.184929, -0.614528],
    specialty: ['Dentistry', 'Cosmetic Dentistry', 'Facial Aesthetics', 'Implantology'],
    areaServed: ['Godalming', 'Guildford', 'Haslemere', 'Farnham', 'Cranleigh'],
    sameAs: ['https://www.cqc.org.uk/location/1-23641125745'],
  },
  'octavia-house': {
    geo: [51.185924, -0.611936],
    specialty: ['Dentistry'],
    areaServed: ['Godalming', 'Guildford', 'Milford', 'Witley', 'Busbridge'],
  },
  'new-octavia': {
    geo: [51.123171, -0.749682],
    specialty: ['Dentistry', 'Cosmetic Dentistry', 'Implantology'],
    areaServed: ['Hindhead', 'Grayshott', 'Haslemere', 'Liphook', 'Churt'],
  },
}

const P = PRACTICE || {
  slug: 'octavia-aesthetic',
  name: 'Octavia Dental & Facial Aesthetics',
  phone: '01483 958205',
  email: 'info@octavia-dental.co.uk',
  address: 'Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ',
  type: 'private',
  hours: [],
}
const X = EXTRAS[P.slug] || {}

// "Seymour House, Lower South Street, Godalming, Surrey GU7 1BZ"
function postalAddress(address = '') {
  const parts = address.split(',').map(s => s.trim()).filter(Boolean)
  const last = parts.pop() || ''
  const pc = last.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i)
  return {
    '@type': 'PostalAddress',
    streetAddress: parts.slice(0, -1).join(', '),
    addressLocality: parts[parts.length - 1],
    addressRegion: pc ? last.slice(0, pc.index).trim() : last,
    postalCode: pc ? pc[0] : undefined,
    addressCountry: 'GB',
  }
}

// "8:30 am – 6:00 pm" / "9:00 am – 5:00 pm (closed 1–2 pm for lunch)" → "HH:MM" ranges
function to24(h, m = '00', ampm) {
  let hr = Number(h) % 12
  if (/pm/i.test(ampm)) hr += 12
  return `${String(hr).padStart(2, '0')}:${m}`
}
function openingHours(hours = []) {
  const specs = []
  for (const { day, hours: text, closed } of hours) {
    if (closed || !text) continue
    const main = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
    if (!main) continue
    const opens = to24(main[1], main[2], main[3])
    const closes = to24(main[4], main[5], main[6])
    const lunch = text.match(/closed\s*(\d{1,2})(?::(\d{2}))?\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
    const ranges = lunch
      ? [[opens, to24(lunch[1], lunch[2], lunch[5])], [to24(lunch[3], lunch[4], lunch[5]), closes]]
      : [[opens, closes]]
    for (const [o, c] of ranges) {
      const same = specs.find(s => s.opens === o && s.closes === c)
      if (same) same.dayOfWeek.push(day)
      else specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: [day], opens: o, closes: c })
    }
  }
  return specs
}

const address = postalAddress(P.address)
const telephone = P.phone ? '+44' + P.phone.replace(/\s+/g, '').replace(/^0/, '') : undefined
const geo = X.geo ? { '@type': 'GeoCoordinates', latitude: X.geo[0], longitude: X.geo[1] } : undefined
const hoursSpec = openingHours(P.hours)

export const dentalClinicSchema = {
  '@context': 'https://schema.org',
  '@type': ['Dentist', 'MedicalBusiness'],
  '@id': `${SITE_URL}/#dentist`,
  name: P.name,
  url: SITE_URL,
  telephone,
  email: P.email,
  image: `${SITE_URL}/images/og-default.webp`,
  logo: `${SITE_URL}/images/logo.png`,
  address,
  geo,
  hasMap: P.googleMapsUrl || undefined,
  priceRange: '££',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
  medicalSpecialty: X.specialty,
  areaServed: [
    ...(X.areaServed || []).map(name => ({ '@type': 'City', name })),
    { '@type': 'AdministrativeArea', name: 'Surrey' },
    { '@type': 'AdministrativeArea', name: 'Hampshire' },
  ],
  openingHoursSpecification: hoursSpec,
  sameAs: [P.instagram, P.googleMapsUrl, ...(X.sameAs || [])].filter(Boolean),
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function treatmentSchema({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name,
    description,
    url: `${SITE_URL}${url}`,
    procedureType: 'https://schema.org/SurgicalProcedure',
    performedBy: {
      '@type': 'Dentist',
      '@id': `${SITE_URL}/#dentist`,
      name: SITE_NAME,
    },
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: url ? `${SITE_URL}${url}` : undefined,
    })),
  }
}

export function blogPostSchema({ title, description, slug, publishedAt, author, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    author: {
      '@type': 'Person',
      name: author,
      worksFor: { '@type': 'Dentist', '@id': `${SITE_URL}/#dentist` },
    },
    image: image || `${SITE_URL}/images/og-default.webp`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
  }
}

export function localBusinessSchema({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${SITE_URL}/${url}#dentist`,
    name: `${SITE_NAME} — ${name}`,
    description,
    url: `${SITE_URL}${url}`,
    telephone,
    address,
    geo,
    openingHoursSpecification: hoursSpec,
    sameAs: [P.instagram].filter(Boolean),
  }
}
