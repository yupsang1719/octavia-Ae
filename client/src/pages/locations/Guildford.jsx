import { usePractice } from '../../contexts/PracticeContext'
import { getLocationBySlug } from '../../data/locations'
import LocationPageTemplate from './LocationPageTemplate'

export default function Guildford() {
  const { slug } = usePractice()
  const location = getLocationBySlug('guildford', slug)
  if (!location) return null
  return <LocationPageTemplate location={location} />
}
