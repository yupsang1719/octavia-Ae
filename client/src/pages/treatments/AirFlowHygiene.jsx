import TreatmentPageTemplate from './TreatmentPageTemplate'
import { getTreatmentById } from '../../data/treatments'
export default function AirFlowHygiene() {
  return <TreatmentPageTemplate treatment={getTreatmentById('air-flow-hygiene')} />
}
