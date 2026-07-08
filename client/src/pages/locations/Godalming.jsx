import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Godalming() {
  const { slug } = usePractice()
  const location = getLocationBySlug('godalming', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
