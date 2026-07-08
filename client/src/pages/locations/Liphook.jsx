import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Liphook() {
  const { slug } = usePractice()
  const location = getLocationBySlug('liphook', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
