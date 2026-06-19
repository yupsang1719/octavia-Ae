import BlogPost from '../models/BlogPost.js'

const SITE_URL = 'https://octavia-dental.co.uk'

const staticPages = [
  { url: '/',                          changefreq: 'weekly',  priority: '1.0' },
  { url: '/treatments/dental-implants',changefreq: 'monthly', priority: '0.9' },
  { url: '/treatments/invisalign',     changefreq: 'monthly', priority: '0.9' },
  { url: '/treatments/composite-bonding', changefreq: 'monthly', priority: '0.9' },
  { url: '/treatments/veneers',        changefreq: 'monthly', priority: '0.8' },
  { url: '/treatments/teeth-whitening',changefreq: 'monthly', priority: '0.8' },
  { url: '/treatments/six-month-smile',changefreq: 'monthly', priority: '0.8' },
  { url: '/treatments/air-flow-hygiene',changefreq:'monthly', priority: '0.7' },
  { url: '/treatments/botox-anti-wrinkle',changefreq:'monthly',priority:'0.8'},
  { url: '/facial-aesthetics',         changefreq: 'monthly', priority: '0.8' },
  { url: '/dentist-godalming',         changefreq: 'monthly', priority: '0.9' },
  { url: '/dentist-guildford',         changefreq: 'monthly', priority: '0.8' },
  { url: '/dentist-haslemere',         changefreq: 'monthly', priority: '0.7' },
  { url: '/dentist-farnham',           changefreq: 'monthly', priority: '0.7' },
  { url: '/dentist-cranleigh',         changefreq: 'monthly', priority: '0.7' },
  { url: '/dentist-hampshire',         changefreq: 'monthly', priority: '0.7' },
  { url: '/nhs-alternative-surrey',    changefreq: 'monthly', priority: '0.8' },
  { url: '/our-team',                  changefreq: 'monthly', priority: '0.7' },
  { url: '/our-team/dr-ali',           changefreq: 'monthly', priority: '0.7' },
  { url: '/our-team/dr-ana',           changefreq: 'monthly', priority: '0.7' },
  { url: '/gallery',                   changefreq: 'weekly',  priority: '0.7' },
  { url: '/blog',                      changefreq: 'weekly',  priority: '0.8' },
  { url: '/contact',                   changefreq: 'monthly', priority: '0.7' },
]

export async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  let posts = []
  try {
    posts = await BlogPost.find({ published: true }).select('slug publishedAt').lean()
  } catch {
    // DB may not be connected in dev
  }

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...posts.map(p => `
  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>
    <lastmod>${p.publishedAt ? p.publishedAt.toISOString().split('T')[0] : today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}\n</urlset>`
}
