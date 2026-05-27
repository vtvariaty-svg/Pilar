import { useEffect, useState } from 'react'
import PlatformLayout from '../../components/platform/PlatformLayout'
import PlatformAdminRoute from '../../components/route/PlatformAdminRoute'
import { subscribeTenants } from '../../services/tenantService'
import type { Tenant } from '../../types/Tenant'

export default function PlatformTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])

  useEffect(() => {
    const unsub = subscribeTenants(setTenants)
    return unsub
  }, [])

  return (
    <PlatformAdminRoute>
      <PlatformLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-white">Tenants</h1>
          <p className="mt-1 text-sm text-white/50">{tenants.length} tenants cadastrados</p>
        </div>

        {tenants.length === 0 ? (
          <p className="text-sm text-white/40">Nenhum tenant ainda. Crie o tenant "pilar" no Firestore Console.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tenants.map((t) => (
              <div key={t.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">{t.name}</p>
                    <p className="text-sm text-white/50">/{t.slug} · ID: {t.id}</p>
                    {t.email && <p className="mt-1 text-xs text-white/40">{t.email}</p>}
                    {t.phone && <p className="text-xs text-white/40">{t.phone}</p>}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${t.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {t.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </PlatformLayout>
    </PlatformAdminRoute>
  )
}
