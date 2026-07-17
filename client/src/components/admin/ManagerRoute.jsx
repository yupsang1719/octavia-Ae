import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ProtectedRoute from './ProtectedRoute'

// Staff (nurse) accounts are limited to Stock > Count, Quick Log, and the
// read-only stock view. Everything else in the CMS — including the other
// Stock screens — requires the manager role.
export default function ManagerRoute({ children }) {
  const { role } = useAuth()
  return (
    <ProtectedRoute>
      {role === 'manager' ? children : <Navigate to="/admin/stock" replace />}
    </ProtectedRoute>
  )
}
