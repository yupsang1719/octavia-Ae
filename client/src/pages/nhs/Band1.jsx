import { getBandBySlug } from '../../data/nhsBands'
import NHSBandPage from './NHSBandPage'

export default function Band1() {
  return <NHSBandPage band={getBandBySlug('band-1')} />
}
