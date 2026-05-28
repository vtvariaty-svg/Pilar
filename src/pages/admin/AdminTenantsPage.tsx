import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeTenants } from '../../services/tenantService'
import type { Tenant } from '../../types/Tenant'

export default function AdminTenantsPage() {
  const { isSuperAdminUser } = useAuth()
  const [tenants, setTenants] = useState<Tenant[]>([])

  useEffect(() => {
    const unsub = subscribeTenants(setTenants)
    return unsub
  }, [])

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
          <h1 className="text-xl font-black text-neutral-950">Empresas / Tenants</h1>
          <p className="mt-1 text-sm text-neutral-500">{tenants.length} tenant(s) cadastrado(s)</p>
        </div>

        {tenants.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Nenhum tenant ainda. Crie o tenant "pilar" no Firestore Console.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {tenants.map((t) => (
              <div key={t.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-neutral-950">{t.name}</p>
                    <p className="text-sm text-neutral-500">/{t.slug} · ID: {t.id}</p>
                    {t.email && <p className="mt-1 text-xs text-neutral-400">{t.email}</p>}
                    {t.phone && <p className="text-xs text-neutral-400">{t.phone}</p>}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      t.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {t.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  )
}
