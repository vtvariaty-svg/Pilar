import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function TenantAdminRoute({ children }: { children: ReactNode }) {
  const { user, isTenantStaff, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
      </div>
    )
  }

  if (!user) return <Navigate to="/entrar" replace />
  if (!isTenantStaff) return <Navigate to="/cliente" replace />
  return <>{children}</>
}
