import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthChange } from '../../services/authService'
import type { User } from 'firebase/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsub = onAuthChange(setUser)
    return unsub
  }, [])

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
