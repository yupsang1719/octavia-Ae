import LocationPageTemplate from './LocationPageTemplate'
import { getLocationBySlug } from '../../data/locations'
export default function Guildford() {
  return <LocationPageTemplate location={getLocationBySlug('guildford')} />
}
