import { useEffect, useState } from 'react'
import { Building2, Users, FileText, Calculator } from 'lucide-react'
import PlatformLayout from '../../components/platform/PlatformLayout'
import PlatformAdminRoute from '../../components/route/PlatformAdminRoute'
import { getTenants } from '../../services/tenantService'
import { subscribeLeads } from '../../services/leadsService'
import { subscribeQuoteEstimates } from '../../services/quoteEstimateService'
import { subscribeCustomers } from '../../services/customerService'
import type { Tenant } from '../../types/Tenant'

export default function PlatformDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [leadCount, setLeadCount] = useState(0)
  const [quoteCount, setQuoteCount] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)

  useEffect(() => {
    getTenants().then(setTenants)
    const u1 = subscribeLeads((l) => setLeadCount(l.length))
    const u2 = subscribeQuoteEstimates((q) => setQuoteCount(q.length))
    const u3 = subscribeCustomers((c) => setCustomerCount(c.length))
    return () => { u1(); u2(); u3() }
  }, [])

  const stats = [
    { label: 'Tenants', value: tenants.length, icon: Building2 },
    { label: 'Clientes', value: customerCount, icon: Users },
    { label: 'Leads totais', value: leadCount, icon: FileText },
    { label: 'Estimativas', value: quoteCount, icon: Calculator },
  ]

  return (
    <PlatformAdminRoute>
      <PlatformLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">Visão global da plataforma</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</p>
                  <p className="mt-1 text-2xl font-black text-white">{value}</p>
                </div>
                <Icon className="h-6 w-6 text-white/30" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold text-white">Tenants ativos</h2>
          {tenants.length === 0 ? (
            <p className="text-sm text-white/40">Nenhum tenant ainda.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {tenants.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.slug} · {t.id}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {t.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PlatformLayout>
    </PlatformAdminRoute>
  )
}
