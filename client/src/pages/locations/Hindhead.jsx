import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Hindhead() {
  const { slug } = usePractice()
  const location = getLocationBySlug('hindhead', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
