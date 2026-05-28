import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ChevronRight } from 'lucide-react'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeCustomerProposals } from '../../services/proposalService'
import { formatDateShort } from '../../utils/formatDate'
import { PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '../../types/Proposal'
import type { Proposal } from '../../types/Proposal'

const TENANT = 'pilar'

export default function ClientProposalsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeCustomerProposals(TENANT, user.uid, (data) => {
      setProposals(data)
      setLoading(false)
    })
    return unsub
  }, [user])

  return (
    <CustomerRoute>
      <ClientLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Minhas propostas</h1>
          <p className="mt-1 text-sm text-neutral-500">{proposals.length} proposta{proposals.length !== 1 ? 's' : ''} recebida{proposals.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <FileText className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhuma proposta recebida ainda</p>
            <p className="mt-1 text-xs text-neutral-400">Quando uma proposta for enviada, ela aparecerá aqui.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {proposals.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/cliente/propostas/${p.id}`)}
                className="w-full rounded-2xl border border-neutral-200 bg-white p-5 text-left transition hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-950">{p.title}</p>
                    {p.description && (
                      <p className="mt-0.5 truncate text-sm text-neutral-500">{p.description}</p>
                    )}
                    <p className="mt-2 text-lg font-bold text-neutral-950">
                      {p.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">{formatDateShort(p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PROPOSAL_STATUS_COLORS[p.status]}`}>
                      {PROPOSAL_STATUS_LABELS[p.status]}
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ClientLayout>
    </CustomerRoute>
  )
}
