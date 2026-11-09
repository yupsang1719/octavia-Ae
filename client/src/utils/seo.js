// One build serves all three practice domains, so the site URL/name come from
// the practice data the server stamps into the page (see server/app.js).
// domains[0] is the bare (non-www) domain — www serves the same pages without
// redirecting, so canonicals must always point at the bare one.
function readInjectedPractice() {
  if (typeof document === 'undefined') return null
  try {
    return JSON.parse(document.getElementById('__PRACTICE_DATA__')?.textContent || 'null')
  } catch {
    return null
  }
}

const practice = readInjectedPractice()

export const SITE_URL  = practice?.domains?.[0] ? `https://${practice.domains[0]}` : 'https://octavia-dental.co.uk'
export const SITE_NAME = practice?.name || 'Octavia Dental & Facial Aesthetics'
export const SITE_DESC = practice?.metaDesc || practice?.tagline ||
  'Private dental & facial aesthetics clinic in Godalming, Surrey. Implants, Invisalign, composite bonding, anti-wrinkle injections. No waiting list. New patients welcome.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.webp`

export function buildMeta({ title, description, canonical, ogImage }) {
  return {
    title,
    description,
    canonical: canonical ? `${SITE_URL}${canonical}` : SITE_URL,
    ogImage:   ogImage || DEFAULT_OG_IMAGE,
  }
}
