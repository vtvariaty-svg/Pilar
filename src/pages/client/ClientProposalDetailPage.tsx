import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, MessageCircle, CheckCircle2, XCircle } from 'lucide-react'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import { useAuth } from '../../contexts/AuthContext'
import { getProposalById, acceptProposal, rejectProposal } from '../../services/proposalService'
import { getLeadById } from '../../services/leadsService'
import { updateLeadStatusWithTimeline } from '../../services/commercialFlowService'
import { formatDate, formatDateShort } from '../../utils/formatDate'
import { PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '../../types/Proposal'
import type { Proposal } from '../../types/Proposal'
import type { Lead } from '../../types/Lead'
import { env } from '../../utils/env'

const TENANT = 'pilar'

export default function ClientProposalDetailPage() {
  const { proposalId } = useParams<{ proposalId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    if (!proposalId) return
    getProposalById(TENANT, proposalId).then((p) => {
      setProposal(p)
      setLoading(false)
    })
  }, [proposalId])

  useEffect(() => {
    if (!proposal?.leadId) return
    getLeadById(TENANT, proposal.leadId).then(setLead)
  }, [proposal?.leadId])

  async function handleAccept() {
    if (!proposal || !user) return
    setActing(true)
    try {
      await acceptProposal(TENANT, proposal.id, proposal.leadId, user.uid)
      if (lead) {
        await updateLeadStatusWithTimeline(TENANT, proposal.leadId, 'fechado', lead.status, user.uid)
      }
      setProposal((prev) => prev ? { ...prev, status: 'aceita' } : prev)
    } finally {
      setActing(false)
    }
  }

  async function handleReject() {
    if (!proposal || !user) return
    setActing(true)
    try {
      await rejectProposal(TENANT, proposal.id, proposal.leadId, user.uid)
      setProposal((prev) => prev ? { ...prev, status: 'recusada' } : prev)
    } finally {
      setActing(false)
    }
  }

  // Garante que o cliente só veja a própria proposta
  if (!loading && proposal && proposal.customerUid && proposal.customerUid !== user?.uid) {
    return (
      <CustomerRoute>
        <ClientLayout>
          <div className="py-20 text-center text-neutral-500">Proposta não encontrada.</div>
        </ClientLayout>
      </CustomerRoute>
    )
  }

  const waMsg = encodeURIComponent(
    `Olá! Tenho dúvidas sobre minha proposta na ${env.companyName}.`,
  )

  if (loading) {
    return (
      <CustomerRoute>
        <ClientLayout>
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        </ClientLayout>
      </CustomerRoute>
    )
  }

  if (!proposal) {
    return (
      <CustomerRoute>
        <ClientLayout>
          <div className="py-20 text-center text-neutral-500">Proposta não encontrada.</div>
        </ClientLayout>
      </CustomerRoute>
    )
  }

  return (
    <CustomerRoute>
      <ClientLayout>
        {/* Ações — ocultas na impressão */}
        <div className="no-print mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/cliente/propostas')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-neutral-950">Proposta</h1>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${env.whatsappNumber}?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Botões de aceitar/recusar — ocultos na impressão */}
        {proposal.status === 'enviada' && (
          <div className="no-print mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="mb-3 font-semibold text-blue-900">O que deseja fazer com esta proposta?</p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                disabled={acting}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                Aceitar proposta
              </button>
              <button
                onClick={handleReject}
                disabled={acting}
                className="flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                Recusar proposta
              </button>
            </div>
          </div>
        )}

        {proposal.status === 'aceita' && (
          <div className="no-print mb-6 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
            ✅ Você aceitou esta proposta. Entraremos em contato para dar início ao projeto.
          </div>
        )}

        {proposal.status === 'recusada' && (
          <div className="no-print mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            Você recusou esta proposta. Se mudar de ideia, entre em contato pelo WhatsApp.
          </div>
        )}

        {/* Documento */}
        <div className="print-page rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          {/* Cabeçalho */}
          <div className="mb-8 flex items-start justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-950">{env.companyName}</h2>
              <p className="mt-1 text-sm text-neutral-500">Proposta Comercial</p>
            </div>
            <div className="text-right">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${PROPOSAL_STATUS_COLORS[proposal.status]}`}>
                {PROPOSAL_STATUS_LABELS[proposal.status]}
              </span>
              {proposal.validUntil && (
                <p className="mt-1 text-xs text-neutral-500">Válida até {proposal.validUntil}</p>
              )}
              <p className="mt-1 text-xs text-neutral-400">Emitida em {formatDateShort(proposal.createdAt)}</p>
            </div>
          </div>

          {/* Dados do cliente */}
          {lead && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Cliente</p>
                <p className="font-semibold text-neutral-900">{lead.name}</p>
                <p className="text-sm text-neutral-600">{lead.city}{lead.neighborhood ? `, ${lead.neighborhood}` : ''}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Serviço</p>
                <p className="font-semibold text-neutral-900">{lead.serviceType}</p>
              </div>
            </div>
          )}

          {/* Título */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-neutral-950">{proposal.title}</h3>
            {proposal.description && (
              <p className="mt-1 text-sm text-neutral-600">{proposal.description}</p>
            )}
          </div>

          {/* Itens */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Descrição</th>
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right">Qtd</th>
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Un</th>
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right">Unit.</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {proposal.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 pr-4 text-neutral-900">{item.description}</td>
                    <td className="py-2.5 pr-4 text-right text-neutral-700">{item.quantity}</td>
                    <td className="py-2.5 pr-4 text-neutral-500">{item.unit}</td>
                    <td className="py-2.5 pr-4 text-right text-neutral-700">
                      {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-2.5 text-right font-medium text-neutral-900">
                      {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totais */}
          <div className="mb-6 flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{proposal.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              {proposal.discount != null && proposal.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Desconto</span>
                  <span>- {proposal.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-neutral-950">{proposal.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>
          </div>

          {/* Condições comerciais */}
          {(proposal.paymentTerms || proposal.executionDeadline || proposal.warrantyInfo || proposal.notes) && (
            <div className="mt-6 grid gap-4 border-t border-neutral-100 pt-6 sm:grid-cols-2">
              {proposal.paymentTerms && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Pagamento</p>
                  <p className="text-sm text-neutral-700">{proposal.paymentTerms}</p>
                </div>
              )}
              {proposal.executionDeadline && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Prazo de execução</p>
                  <p className="text-sm text-neutral-700">{proposal.executionDeadline}</p>
                </div>
              )}
              {proposal.warrantyInfo && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Garantia</p>
                  <p className="text-sm text-neutral-700">{proposal.warrantyInfo}</p>
                </div>
              )}
              {proposal.notes && (
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Observações</p>
                  <p className="text-sm text-neutral-700">{proposal.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Rodapé */}
          <div className="mt-10 border-t border-neutral-100 pt-6 text-center text-xs text-neutral-400">
            <p>{env.companyName} · {env.serviceRegion}</p>
            {proposal.sentAt && <p className="mt-1">Enviada em {formatDate(proposal.sentAt)}</p>}
          </div>
        </div>
      </ClientLayout>
    </CustomerRoute>
  )
}
