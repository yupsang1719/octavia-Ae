import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function SixMonthSmile() {
  return <TreatmentPageTemplate treatment={getTreatmentById('six-month-smile')} />
}
