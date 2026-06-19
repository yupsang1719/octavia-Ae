import LocationPageTemplate from './LocationPageTemplate'
import { getLocationBySlug } from '../../data/locations'
export default function Farnham() {
  return <LocationPageTemplate location={getLocationBySlug('farnham')} />
}
