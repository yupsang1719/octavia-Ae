import { useState, useEffect } from 'react'
import { getBandBySlug } from '../../data/nhsBands'
import NHSBandPage from './NHSBandPage'

export default function Band2() {
  const [band, setBand] = useState(getBandBySlug('band-2'))

  useEffect(() => {
    fetch('/api/treatments/nhs-bands')
      .then(r => r.json())
      .then(data => {
        const found = Array.isArray(data) && data.find(b => b.slug === 'band-2')
        if (found) setBand(found)
      })
      .catch(() => {})
  }, [])

  return <NHSBandPage band={band} />
}
