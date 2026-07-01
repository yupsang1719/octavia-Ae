import { SITE_URL } from './seo'

export const dentalClinicSchema = {
  '@context': 'https://schema.org',
  '@type': ['Dentist', 'MedicalBusiness'],
  '@id': `${SITE_URL}/#dentist`,
  name: 'Octavia Dental & Facial Aesthetics',
  url: SITE_URL,
  telephone: '+441483958205',
  email: 'info@octavia-dental.co.uk',
  image: `${SITE_URL}/images/og-default.webp`,
  logo: `${SITE_URL}/images/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Seymour House, Lower South Street',
    addressLocality: 'Godalming',
    addressRegion: 'Surrey',
    postalCode: 'GU7 1BZ',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.1856,
    longitude: -0.6153,
  },
  hasMap: 'https://maps.google.com/maps?q=Seymour+House,+Lower+South+Street,+Godalming,+GU7+1BZ',
  priceRange: '££',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
  medicalSpecialty: ['Dentistry', 'Cosmetic Dentistry', 'Facial Aesthetics', 'Implantology'],
  areaServed: [
    { '@type': 'City', name: 'Godalming' },
    { '@type': 'City', name: 'Guildford' },
    { '@type': 'City', name: 'Haslemere' },
    { '@type': 'City', name: 'Farnham' },
    { '@type': 'City', name: 'Cranleigh' },
    { '@type': 'AdministrativeArea', name: 'Surrey' },
    { '@type': 'AdministrativeArea', name: 'Hampshire' },
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '08:30', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:30', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
  ],
  sameAs: [
    'https://www.instagram.com/octaviadental',
    'https://www.google.com/maps/search/?api=1&query=Octavia+Dental+%26+Facial+Aesthetics+Godalming',
    'https://www.cqc.org.uk/location/1-23641125745',
  ],
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
      name: 'Octavia Dental & Facial Aesthetics',
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
      name: 'Octavia Dental & Facial Aesthetics',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
  }
}

export function localBusinessSchema({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${SITE_URL}/${url}#dentist`,
    name: `Octavia Dental & Facial Aesthetics — ${name}`,
    description,
    url: `${SITE_URL}${url}`,
    telephone: '+441483958205',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Seymour House, Lower South Street',
      addressLocality: 'Godalming',
      addressRegion: 'Surrey',
      postalCode: 'GU7 1BZ',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.1856,
      longitude: -0.6153,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '08:30', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:30', closes: '17:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
    ],
    sameAs: ['https://www.instagram.com/octaviadental'],
  }
}
