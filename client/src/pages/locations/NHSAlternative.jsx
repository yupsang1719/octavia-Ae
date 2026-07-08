import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function NHSAlternative() {
  const { slug } = usePractice()
  const location = getLocationBySlug('nhs-alternative', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
