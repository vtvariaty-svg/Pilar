import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeCustomerLeads } from '../../services/leadsService'
import { formatDate } from '../../utils/formatDate'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/Lead'
import type { Lead } from '../../types/Lead'

export default function ClientLeadsPage() {
  const { user, currentTenantId } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeCustomerLeads(user.uid, currentTenantId, (data) => {
      setLeads(data)
      setLoading(false)
    })
    return unsub
  }, [user, currentTenantId])

  return (
    <CustomerRoute>
      <ClientLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Minhas solicitações</h1>
          <p className="mt-1 text-sm text-neutral-500">{leads.length} solicitações enviadas</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <FileText className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhuma solicitação ainda</p>
            <p className="mt-1 text-xs text-neutral-400">Envie seu pedido de orçamento pelo formulário no site.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {leads.map((l) => (
              <div key={l.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-950">{l.serviceType}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">{l.city}{l.neighborhood ? ` · ${l.neighborhood}` : ''}</p>
                    <p className="mt-2 text-xs text-neutral-400">Enviado em {formatDate(l.createdAt)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[l.status]}`}>
                    {STATUS_LABELS[l.status]}
                  </span>
                </div>
                {l.description && (
                  <p className="mt-3 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">{l.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </ClientLayout>
    </CustomerRoute>
  )
}
