import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-gold/40 animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/admin/login" replace />
}
