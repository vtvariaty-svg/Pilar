import { useEffect, useState, useMemo } from 'react'
import { Users, TrendingUp } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import LeadCard from '../../components/admin/LeadCard'
import LeadFilters from '../../components/admin/LeadFilters'
import LeadDetails from '../../components/admin/LeadDetails'
import { subscribeLeads } from '../../services/leadsService'
import type { Lead, LeadStatus } from '../../types/Lead'
import { STATUS_LABELS } from '../../types/Lead'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'todos'>('todos')
  const [serviceFilter, setServiceFilter] = useState('todos')

  useEffect(() => {
    const unsub = subscribeLeads((data) => {
      setLeads(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter((l) => {
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.neighborhood.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'todos' || l.status === statusFilter
      const matchService = serviceFilter === 'todos' || l.serviceType === serviceFilter
      return matchSearch && matchStatus && matchService
    })
  }, [leads, search, statusFilter, serviceFilter])

  const newCount = leads.filter((l) => l.status === 'novo').length

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Pedidos</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {leads.length} pedidos no total Â· {newCount} novos
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(['novo', 'em_atendimento', 'fechado', 'perdido'] as LeadStatus[]).map((s) => (
            <div key={s} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-black">{leads.filter((l) => l.status === s).length}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{STATUS_LABELS[s]}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <LeadFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            serviceFilter={serviceFilter}
            onServiceChange={setServiceFilter}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <Users className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhum pedido encontrado</p>
            <p className="mt-1 text-xs text-neutral-400">Tente outros filtros ou aguarde novas solicitaÃ§Ãµes.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onClick={() => setSelected(lead)} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="mt-4 flex items-center gap-1 text-xs text-neutral-400">
            <TrendingUp className="h-3 w-3" />
            Exibindo {filtered.length} de {leads.length} pedidos
          </p>
        )}

        {selected && (
          <LeadDetails
            lead={selected}
            onClose={() => setSelected(null)}
            onUpdated={() => setSelected(null)}
          />
        )}
      </AdminLayout>
    </AdminRoute>
  )
}

