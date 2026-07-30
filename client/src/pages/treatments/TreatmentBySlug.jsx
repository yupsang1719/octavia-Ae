import { useParams } from 'react-router-dom'
import TreatmentPageTemplate from './TreatmentPageTemplate'

// Catch-all for treatments created via the CMS that don't have a
// dedicated hardcoded page (the original 14 treatments each still route
// to their own file above this in App.jsx — more specific routes win).
export default function TreatmentBySlug() {
  const { slug } = useParams()
  return <TreatmentPageTemplate slug={slug} />
}
