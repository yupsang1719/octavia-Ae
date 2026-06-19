import LocationPageTemplate from './LocationPageTemplate'
import { getLocationBySlug } from '../../data/locations'
export default function Cranleigh() {
  return <LocationPageTemplate location={getLocationBySlug('cranleigh')} />
}
