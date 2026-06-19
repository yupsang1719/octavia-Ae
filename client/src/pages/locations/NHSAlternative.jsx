import LocationPageTemplate from './LocationPageTemplate'
import { getLocationBySlug } from '../../data/locations'
export default function NHSAlternative() {
  return <LocationPageTemplate location={getLocationBySlug('nhs-alternative')} />
}
