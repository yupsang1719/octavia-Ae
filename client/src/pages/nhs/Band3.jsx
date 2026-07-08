import { useState, useEffect } from 'react'
import { getBandBySlug } from '../../data/nhsBands'
import NHSBandPage from './NHSBandPage'

export default function Band3() {
  const [band, setBand] = useState(getBandBySlug('band-3'))

  useEffect(() => {
    fetch('/api/treatments/nhs-bands')
      .then(r => r.json())
      .then(data => {
        const found = Array.isArray(data) && data.find(b => b.slug === 'band-3')
        if (found) setBand(found)
      })
      .catch(() => {})
  }, [])

  return <NHSBandPage band={band} />
}
