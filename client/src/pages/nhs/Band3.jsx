import { getBandBySlug } from '../../data/nhsBands'
import NHSBandPage from './NHSBandPage'

export default function Band3() {
  return <NHSBandPage band={getBandBySlug('band-3')} />
}
