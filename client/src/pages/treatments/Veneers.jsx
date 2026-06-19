import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function Veneers() {
  return <TreatmentPageTemplate treatment={getTreatmentById('veneers')} />
}
