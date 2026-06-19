import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function TeethWhitening() {
  return <TreatmentPageTemplate treatment={getTreatmentById('teeth-whitening')} />
}
