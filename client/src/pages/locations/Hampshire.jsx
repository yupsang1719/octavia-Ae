import LocationPageTemplate from './LocationPageTemplate'
import { getLocationBySlug } from '../../data/locations'
export default function Hampshire() {
  return <LocationPageTemplate location={getLocationBySlug('hampshire')} />
}
