import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdminUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  if (!isAdminUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-100 px-4 text-center">
        <p className="text-lg font-bold text-neutral-950">Acesso não autorizado</p>
        <p className="text-sm text-neutral-500">
          Sua conta não tem permissão para acessar o painel administrativo.
        </p>
        {user.email === 'vtvariaty@gmail.com' && (
          <a
            href="/admin/bootstrap"
            className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
          >
            Configurar acesso admin
          </a>
        )}
        <a href="/entrar" className="text-sm text-neutral-500 underline">
          Voltar ao login
        </a>
      </div>
    )
  }

  return <>{children}</>
}
