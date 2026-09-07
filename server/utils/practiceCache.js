import Practice from '../models/Practice.js'

const TTL = 5 * 60 * 1000

let byslug = null
let cachedAt = 0

async function refresh() {
  const docs = await Practice.find().lean()
  byslug = Object.fromEntries(docs.map(p => [p.slug, p]))
  cachedAt = Date.now()
  return byslug
}

export async function getCachedPractice(slug) {
  if (!byslug || Date.now() - cachedAt > TTL) {
    try {
      await refresh()
    } catch {
      // DB hiccup — keep serving whatever we last had, even if stale
    }
  }
  return byslug?.[slug] || null
}

export function invalidatePracticeCache() {
  byslug = null
}
