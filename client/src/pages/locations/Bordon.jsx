import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Bordon() {
  const { slug } = usePractice()
  const location = getLocationBySlug('bordon', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
