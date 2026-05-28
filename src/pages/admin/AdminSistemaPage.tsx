import { Navigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminSistemaPage() {
  const { isSuperAdminUser } = useAuth()

  if (!isSuperAdminUser) {
    return (
      <AdminRoute>
        <AdminLayout>
          <Navigate to="/admin/dashboard" replace />
        </AdminLayout>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Sistema</h1>
          <p className="mt-1 text-sm text-neutral-500">Configuracoes globais da plataforma</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-400">
          Configuracoes globais — em desenvolvimento.
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}
