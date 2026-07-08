import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Farnham() {
  const { slug } = usePractice()
  const location = getLocationBySlug('farnham', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
