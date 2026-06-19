import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function DentalImplants() {
  return <TreatmentPageTemplate treatment={getTreatmentById('dental-implants')} />
}
