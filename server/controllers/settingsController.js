import SiteSettings from '../models/SiteSettings.js'
import Treatment from '../models/Treatment.js'

const DEFAULTS = [
  { value: '500+', label: 'Happy patients' },
  { value: '5.0★', label: 'Google rating' },
  { value: '2',    label: 'Specialist dentists' },
  { value: 'Transparent', label: 'Pricing' },
  { value: 'None', label: 'Waiting list' },
]

const DEFAULT_HOURS = [
  { day: 'Monday',    hours: '8:30 am – 6:00 pm', closed: false },
  { day: 'Tuesday',   hours: '8:30 am – 6:00 pm', closed: false },
  { day: 'Wednesday', hours: '8:30 am – 6:00 pm', closed: false },
  { day: 'Thursday',  hours: '8:30 am – 6:00 pm', closed: false },
  { day: 'Friday',    hours: '8:30 am – 5:00 pm', closed: false },
  { day: 'Saturday',  hours: '9:00 am – 2:00 pm', closed: false },
  { day: 'Sunday',    hours: '',                   closed: true  },
]

export async function getTrustBar(req, res) {
  try {
    const settings = await SiteSettings.findOne({ practice: req.practiceSlug })
    res.json(settings?.trustBar?.length ? settings.trustBar : DEFAULTS)
  } catch {
    res.json(DEFAULTS)
  }
}

export async function updateTrustBar(req, res) {
  try {
    const { stats } = req.body
    if (!Array.isArray(stats)) return res.status(400).json({ error: 'stats must be an array' })
    const settings = await SiteSettings.findOneAndUpdate(
      { practice: req.practiceSlug },
      { trustBar: stats },
      { upsert: true, new: true }
    )
    res.json(settings.trustBar)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getOpeningHours(req, res) {
  try {
    const settings = await SiteSettings.findOne({ practice: req.practiceSlug })
    res.json(settings?.openingHours?.length ? settings.openingHours : DEFAULT_HOURS)
  } catch {
    res.json(DEFAULT_HOURS)
  }
}

export async function updateOpeningHours(req, res) {
  try {
    const { hours } = req.body
    if (!Array.isArray(hours)) return res.status(400).json({ error: 'hours must be an array' })
    const settings = await SiteSettings.findOneAndUpdate(
      { practice: req.practiceSlug },
      { openingHours: hours },
      { upsert: true, new: true }
    )
    res.json(settings.openingHours)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ── Price list ─────────────────────────────────────────────────────────────
 * Rows linked to a treatment (href "/treatments/<slug>") always take their
 * name and price from the Treatments CMS, so prices are edited in one place.
 * Rows without a treatment link are extra services typed in the Price List
 * tab. Published treatments missing from the saved list are added to their
 * default group; unpublished or deleted treatments drop out. */
const PRICE_GROUPS = [
  { category: 'General & Hygiene',        slugs: ['general-dentistry', 'dental-hygiene', 'air-flow-hygiene'] },
  { category: 'Cosmetic & Orthodontics',  slugs: ['composite-bonding', 'veneers', 'teeth-whitening', 'six-month-smile', 'invisalign'] },
  { category: 'Implants & Restorative',   slugs: ['dental-implants'] },
  { category: 'Facial Aesthetics',        slugs: ['botox-anti-wrinkle'] },
]
const TREATMENT_HREF = /^\/treatments\/([^/?#]+)\/?$/

function cleanPrice(p) {
  const v = (p || '').trim()
  if (!v || v === '-') return 'Price on consultation'
  return v.startsWith('£') ? `From ${v}` : v
}

function defaultGroup(t) {
  const g = PRICE_GROUPS.find(g => g.slugs.includes(t.slug))
  if (g) return g.category
  return /restorative/i.test(t.category || '') ? 'Implants & Restorative' : 'General & Hygiene'
}

async function buildPriceList(practice) {
  const [settings, treatments] = await Promise.all([
    SiteSettings.findOne({ practice }, 'priceList').lean(),
    Treatment
      .find({ practice, published: { $ne: false }, type: { $ne: 'nhs-band' } }, 'slug name priceFrom category order')
      .sort({ order: 1 })
      .lean(),
  ])
  const bySlug = new Map(treatments.map(t => [t.slug, t]))
  const seen = new Set()

  const categories = (settings?.priceList || []).map(c => ({
    category: c.category,
    items: c.items.flatMap(item => {
      const slug = item.href?.match(TREATMENT_HREF)?.[1]
      if (!slug) return [{ ...item, linked: false }]
      const t = bySlug.get(slug)
      if (!t || seen.has(slug)) return []            // unpublished/deleted/duplicate
      seen.add(slug)
      return [{ name: t.name, price: cleanPrice(t.priceFrom), note: item.note || '', href: `/treatments/${slug}`, linked: true }]
    }),
  }))

  for (const t of treatments) {
    if (seen.has(t.slug)) continue
    const name = defaultGroup(t)
    let cat = categories.find(c => c.category === name)
    if (!cat) {
      cat = { category: name, items: [] }
      // keep the default group order when creating categories
      const order = PRICE_GROUPS.map(g => g.category)
      const at = categories.findIndex(c => order.indexOf(c.category) > order.indexOf(name))
      at < 0 ? categories.push(cat) : categories.splice(at, 0, cat)
    }
    cat.items.push({ name: t.name, price: cleanPrice(t.priceFrom), note: '', href: `/treatments/${t.slug}`, linked: true })
  }
  return categories.filter(c => c.items.length)
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function getPriceList(req, res) {
  try {
    res.json(await buildPriceList(req.practiceSlug))
  } catch {
    res.json([])
  }
}

export async function updatePriceList(req, res) {
  try {
    const { categories } = req.body
    if (!Array.isArray(categories) || categories.length > 30) {
      return res.status(400).json({ error: 'categories must be an array (max 30)' })
    }
    const clean = []
    for (const c of categories) {
      const category = str(c?.category, 80)
      if (!category) return res.status(400).json({ error: 'Every category needs a name' })
      if (!Array.isArray(c.items) || c.items.length > 100) {
        return res.status(400).json({ error: `"${category}" must have a list of up to 100 items` })
      }
      const items = []
      for (const i of c.items) {
        const href = str(i?.href, 200)
        const linked = TREATMENT_HREF.test(href)
        const name = str(i?.name, 120)
        if (!name && !linked) return res.status(400).json({ error: `Every item in "${category}" needs a name` })
        // Linked rows store only their position and note; name/price come from Treatments
        items.push({
          name:  name || href,
          price: linked ? '' : str(i.price, 60),
          note:  str(i.note, 300),
          href:  href.startsWith('/') ? href : '',
        })
      }
      clean.push({ category, items })
    }
    await SiteSettings.findOneAndUpdate(
      { practice: req.practiceSlug },
      { priceList: clean },
      { upsert: true }
    )
    res.json(await buildPriceList(req.practiceSlug))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
