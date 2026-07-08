import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Cranleigh() {
  const { slug } = usePractice()
  const location = getLocationBySlug('cranleigh', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
