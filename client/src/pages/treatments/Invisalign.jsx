import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function Invisalign() {
  return <TreatmentPageTemplate treatment={getTreatmentById('invisalign')} />
}
