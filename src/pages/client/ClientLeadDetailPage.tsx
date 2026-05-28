import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, CalendarCheck } from 'lucide-react'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeLeadById } from '../../services/leadsService'
import { getQuoteEstimate } from '../../services/quoteEstimateService'
import { getAppointment } from '../../services/appointmentService'
import { subscribeLeadTimeline } from '../../services/commercialFlowService'
import { subscribeLeadProposals } from '../../services/proposalService'
import { formatDate, formatDateShort } from '../../utils/formatDate'
import { formatCurrency } from '../../services/quoteCalculator'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/Lead'
import { APPOINTMENT_STATUS_LABELS } from '../../types/Appointment'
import { PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '../../types/Proposal'
import type { Lead } from '../../types/Lead'
import type { QuoteEstimate } from '../../types/QuoteEstimate'
import type { Appointment } from '../../types/Appointment'
import type { TimelineEvent } from '../../types/TimelineEvent'
import type { Proposal } from '../../types/Proposal'
import { env } from '../../utils/env'

const TENANT = 'pilar'

const TIMELINE_ICONS: Record<string, string> = {
  quote_created: '📊',
  lead_created: '📋',
  appointment_requested: '📅',
  appointment_confirmed: '✅',
  status_changed: '🔄',
  proposal_sent: '📨',
  note_added: '📝',
  closed: '🎉',
  lost: '❌',
}

const NEXT_STEPS: Record<string, string> = {
  novo: 'Sua solicitação foi recebida. Entraremos em contato em breve.',
  em_atendimento: 'Estamos analisando sua solicitação. Em breve você receberá um retorno.',
  visita_agendada: 'Visita técnica agendada! Confirmaremos o horário por WhatsApp.',
  proposta_enviada: 'Sua proposta está pronta. Confira abaixo e entre em contato se tiver dúvidas.',
  fechado: 'Parabéns! Seu projeto está em andamento.',
  perdido: 'Esta solicitação foi encerrada.',
}

export default function ClientLeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [lead, setLead] = useState<Lead | null>(null)
  const [quote, setQuote] = useState<QuoteEstimate | null>(null)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!leadId) return
    const unsub = subscribeLeadById(TENANT, leadId, (l) => {
      setLead(l)
      setLoading(false)
    })
    return unsub
  }, [leadId])

  useEffect(() => {
    if (!lead?.quoteEstimateId) return
    getQuoteEstimate(TENANT, lead.quoteEstimateId).then(setQuote)
  }, [lead?.quoteEstimateId])

  useEffect(() => {
    if (!lead?.appointmentId) return
    getAppointment(TENANT, lead.appointmentId).then(setAppointment)
  }, [lead?.appointmentId])

  useEffect(() => {
    if (!leadId) return
    const unsub = subscribeLeadTimeline(TENANT, leadId, (events) =>
      setTimeline(events.filter((e) => e.visibility === 'customer')),
    )
    return unsub
  }, [leadId])

  useEffect(() => {
    if (!leadId) return
    const unsub = subscribeLeadProposals(TENANT, leadId, (items) =>
      setProposals(items.filter((p) => p.status !== 'rascunho')),
    )
    return unsub
  }, [leadId])

  const waMsg = encodeURIComponent(
    `Olá! Tenho uma dúvida sobre minha solicitação na ${env.companyName}.`,
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

  if (!lead || (lead.customerUid && lead.customerUid !== user?.uid)) {
    return (
      <CustomerRoute>
        <ClientLayout>
          <div className="py-20 text-center text-neutral-500">Solicitação não encontrada.</div>
        </ClientLayout>
      </CustomerRoute>
    )
  }

  return (
    <CustomerRoute>
      <ClientLayout>
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/cliente/solicitacoes')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-neutral-950">{lead.serviceType}</h1>
            <p className="mt-0.5 text-sm text-neutral-500">{lead.city}{lead.neighborhood ? ` · ${lead.neighborhood}` : ''}</p>
          </div>
          <Badge className={STATUS_COLORS[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
        </div>

        <div className="flex flex-col gap-5">
          {/* Next step banner */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
            <p className="text-sm font-semibold text-blue-900">Próximo passo</p>
            <p className="mt-1 text-sm text-blue-700">{NEXT_STEPS[lead.status] ?? '—'}</p>
          </div>

          {/* Quote estimate */}
          {quote && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Sua estimativa</h2>
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                <p className="font-semibold text-neutral-900">{quote.serviceType}</p>
                <p className="mt-1 text-lg font-bold text-neutral-950">
                  {formatCurrency(quote.calculation.estimatedLow)} – {formatCurrency(quote.calculation.estimatedHigh)}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {quote.inputs.areaM2 ? `${quote.inputs.areaM2} m² · ` : ''}
                  Calculado em {formatDateShort(quote.createdAt)}
                </p>
              </div>
            </section>
          )}

          {/* Appointment */}
          {appointment && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Visita técnica</h2>
              <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-purple-900">{appointment.date} às {appointment.startTime}</p>
                    <p className="text-xs text-purple-600">{appointment.city}{appointment.neighborhood ? ` · ${appointment.neighborhood}` : ''}</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  {APPOINTMENT_STATUS_LABELS[appointment.status]}
                </Badge>
              </div>
            </section>
          )}

          {/* Proposals */}
          {proposals.length > 0 && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Proposta</h2>
              <div className="flex flex-col gap-3">
                {proposals.map((p) => (
                  <div key={p.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-neutral-900">{p.title}</p>
                        {p.description && (
                          <p className="mt-0.5 text-sm text-neutral-600">{p.description}</p>
                        )}
                        <p className="mt-2 text-xl font-black text-neutral-950">{formatCurrency(p.total)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PROPOSAL_STATUS_COLORS[p.status]}`}>
                        {PROPOSAL_STATUS_LABELS[p.status]}
                      </span>
                    </div>
                    {p.status === 'enviada' && (
                      <p className="mt-3 text-xs text-neutral-500">
                        Entre em contato pelo WhatsApp para confirmar ou tirar dúvidas sobre esta proposta.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Histórico</h2>
              <ol className="relative border-l border-neutral-200">
                {timeline.map((evt) => (
                  <li key={evt.id} className="mb-5 ml-4">
                    <div className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-white bg-neutral-300" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {TIMELINE_ICONS[evt.type] ?? '•'} {evt.title}
                      </p>
                      {evt.description && (
                        <p className="mt-0.5 text-xs text-neutral-500">{evt.description}</p>
                      )}
                      <p className="mt-1 text-xs text-neutral-400">{formatDate(evt.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${env.whatsappNumber}?text=${waMsg}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
            Falar pelo WhatsApp
          </a>
        </div>
      </ClientLayout>
    </CustomerRoute>
  )
}
