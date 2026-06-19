import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function CompositeBonding() {
  return <TreatmentPageTemplate treatment={getTreatmentById('composite-bonding')} />
}
