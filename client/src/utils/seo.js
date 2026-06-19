export const SITE_URL = 'https://octavia-dental.co.uk'
export const SITE_NAME = 'Octavia Dental & Facial Aesthetics'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.webp`

export function buildMeta({ title, description, canonical, ogImage }) {
  return {
    title,
    description,
    canonical: canonical ? `${SITE_URL}${canonical}` : SITE_URL,
    ogImage:   ogImage || DEFAULT_OG_IMAGE,
  }
}
