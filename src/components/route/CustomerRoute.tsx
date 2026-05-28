import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function CustomerRoute({ children }: { children: ReactNode }) {
  const { user, loading, isPlatformAdmin, isAdminUser } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
      </div>
    )
  }

  if (!user) return <Navigate to="/entrar" replace />
  if (isPlatformAdmin) return <Navigate to="/platform" replace />
  if (isAdminUser) return <Navigate to="/admin/dashboard" replace />
  return <>{children}</>
}
