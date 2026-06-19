import LocationPageTemplate from './LocationPageTemplate'
import { getLocationBySlug } from '../../data/locations'
export default function Godalming() {
  return <LocationPageTemplate location={getLocationBySlug('godalming')} />
}
