import { useEffect, useState } from 'react'

// Module-level cache shared by every component that calls useTreatments(),
// so one page load fires a single /api/treatments request no matter how
// many components (navbar, footer, forms, grids...) need the list.
let cache = null
let inflight = null

function fetchTreatments() {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetch('/api/treatments')
      .then(r => r.json())
      .then(data => {
        cache = Array.isArray(data) ? data : []
        return cache
      })
      .finally(() => { inflight = null })
  }
  return inflight
}

export function useTreatments() {
  const [treatments, setTreatments] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    fetchTreatments()
      .then(data => { if (!cancelled) setTreatments(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { treatments, loading }
}
