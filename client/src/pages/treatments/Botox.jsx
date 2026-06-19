import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function Botox() {
  return <TreatmentPageTemplate treatment={getTreatmentById('botox-anti-wrinkle')} />
}
