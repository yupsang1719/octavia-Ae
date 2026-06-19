import LocationPageTemplate from './LocationPageTemplate'
import { getLocationBySlug } from '../../data/locations'
export default function Haslemere() {
  return <LocationPageTemplate location={getLocationBySlug('haslemere')} />
}
