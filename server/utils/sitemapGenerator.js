import BlogPost from '../models/BlogPost.js'

const PRACTICE_CONFIG = {
  'octavia-aesthetic': {
    siteUrl: 'https://octavia-dental.co.uk',
    locations: [
      { url: '/dentist-godalming',      priority: '0.9' },
      { url: '/dentist-guildford',      priority: '0.8' },
      { url: '/dentist-haslemere',      priority: '0.7' },
      { url: '/dentist-farnham',        priority: '0.7' },
      { url: '/dentist-cranleigh',      priority: '0.7' },
      { url: '/dentist-hampshire',      priority: '0.7' },
      { url: '/nhs-alternative-surrey', priority: '0.8' },
    ],
  },
  'octavia-house': {
    siteUrl: 'https://octaviahousedentalpractice.co.uk',
    locations: [
      { url: '/dentist-godalming',  priority: '0.9' },
      { url: '/dentist-guildford',  priority: '0.8' },
      { url: '/dentist-haslemere',  priority: '0.7' },
      { url: '/dentist-farnham',    priority: '0.7' },
      { url: '/dentist-cranleigh',  priority: '0.7' },
    ],
  },
  'new-octavia': {
    siteUrl: 'https://newoctaviadentalsurgery.com',
    locations: [
      { url: '/dentist-hindhead',   priority: '0.9' },
      { url: '/dentist-grayshott',  priority: '0.8' },
      { url: '/dentist-haslemere',  priority: '0.8' },
      { url: '/dentist-liphook',    priority: '0.7' },
      { url: '/dentist-bordon',     priority: '0.7' },
      { url: '/dentist-hampshire',  priority: '0.7' },
    ],
  },
}

const SHARED_PAGES = [
  { url: '/',                              changefreq: 'weekly',  priority: '1.0' },
  { url: '/treatments/dental-implants',    changefreq: 'monthly', priority: '0.9' },
  { url: '/treatments/invisalign',         changefreq: 'monthly', priority: '0.9' },
  { url: '/treatments/composite-bonding',  changefreq: 'monthly', priority: '0.9' },
  { url: '/treatments/veneers',            changefreq: 'monthly', priority: '0.8' },
  { url: '/treatments/teeth-whitening',    changefreq: 'monthly', priority: '0.8' },
  { url: '/treatments/six-month-smile',    changefreq: 'monthly', priority: '0.8' },
  { url: '/treatments/air-flow-hygiene',   changefreq: 'monthly', priority: '0.7' },
  { url: '/treatments/botox-anti-wrinkle', changefreq: 'monthly', priority: '0.8' },
  { url: '/treatments/general-dentistry',  changefreq: 'monthly', priority: '0.8' },
  { url: '/facial-aesthetics',             changefreq: 'monthly', priority: '0.8' },
  { url: '/our-team',                      changefreq: 'monthly', priority: '0.7' },
  { url: '/gallery',                       changefreq: 'weekly',  priority: '0.7' },
  { url: '/blog',                          changefreq: 'weekly',  priority: '0.8' },
  { url: '/contact',                       changefreq: 'monthly', priority: '0.7' },
]

export async function generateSitemap(practiceSlug = 'octavia-aesthetic') {
  const config = PRACTICE_CONFIG[practiceSlug] ?? PRACTICE_CONFIG['octavia-aesthetic']
  const { siteUrl, locations } = config
  const today = new Date().toISOString().split('T')[0]

  let posts = []
  try {
    posts = await BlogPost.find({ published: true }).select('slug publishedAt').lean()
  } catch {
    // DB may not be connected
  }

  const toXml = ({ url, changefreq = 'monthly', priority }) => `
  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`

  const urls = [
    ...SHARED_PAGES.map(toXml),
    ...locations.map(toXml),
    ...posts.map(p => toXml({
      url: `/blog/${p.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}\n</urlset>`
}
