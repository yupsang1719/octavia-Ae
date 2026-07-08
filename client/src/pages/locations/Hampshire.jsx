import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Hampshire() {
  const { slug } = usePractice()
  const location = getLocationBySlug('hampshire', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
