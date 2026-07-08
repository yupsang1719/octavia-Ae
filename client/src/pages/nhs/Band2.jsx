import { getBandBySlug } from '../../data/nhsBands'
import NHSBandPage from './NHSBandPage'

export default function Band2() {
  return <NHSBandPage band={getBandBySlug('band-2')} />
}
