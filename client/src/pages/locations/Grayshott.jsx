import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Grayshott() {
  const { slug } = usePractice()
  const location = getLocationBySlug('grayshott', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
