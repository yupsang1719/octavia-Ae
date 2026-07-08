import { useState, useEffect } from 'react'
import { getBandBySlug } from '../../data/nhsBands'
import NHSBandPage from './NHSBandPage'

export default function Band1() {
  const [band, setBand] = useState(getBandBySlug('band-1'))

  useEffect(() => {
    fetch('/api/treatments/nhs-bands')
      .then(r => r.json())
      .then(data => {
        const found = Array.isArray(data) && data.find(b => b.slug === 'band-1')
        if (found) setBand(found)
      })
      .catch(() => {})
  }, [])

  return <NHSBandPage band={band} />
}
