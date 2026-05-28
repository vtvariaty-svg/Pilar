import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MessageCircle,
  Save,
  Plus,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  FileText,
  ExternalLink,
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProposalForm from '../../components/admin/proposals/ProposalForm'
import { subscribeLeadById, updateLeadNotes } from '../../services/leadsService'
import { getQuoteEstimate } from '../../services/quoteEstimateService'
import { getAppointment } from '../../services/appointmentService'
import {
  subscribeLeadTimeline,
  updateLeadStatusWithTimeline,
  createTimelineEvent,
} from '../../services/commercialFlowService'
import {
  subscribeLeadProposals,
  createProposal,
  sendProposal,
  type ProposalFormData,
} from '../../services/proposalService'
import { subscribeTasksByLead, completeTask, createTask } from '../../services/taskService'
import TaskForm, { type TaskFormValues } from '../../components/admin/tasks/TaskForm'
import {
  TASK_TYPE_LABELS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_COLORS,
  type Task,
} from '../../types/Task'
import { Timestamp } from 'firebase/firestore'
import { formatDate, formatDateShort } from '../../utils/formatDate'
import { whatsappLinkForLead } from '../../utils/whatsapp'
import { formatCurrency } from '../../services/quoteCalculator'
import { STATUS_LABELS, STATUS_COLORS, type LeadStatus } from '../../types/Lead'
import { APPOINTMENT_STATUS_LABELS } from '../../types/Appointment'
import { PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '../../types/Proposal'
import type { Lead } from '../../types/Lead'
import type { QuoteEstimate } from '../../types/QuoteEstimate'
import type { Appointment } from '../../types/Appointment'
import type { TimelineEvent } from '../../types/TimelineEvent'
import type { Proposal } from '../../types/Proposal'
import { useAuth } from '../../contexts/AuthContext'

const TENANT = 'pilar'

const TIMELINE_ICONS: Record<string, string> = {
  quote_created: '📊',
  lead_created: '📋',
  appointment_requested: '📅',
  appointment_confirmed: '✅',
  status_changed: '🔄',
  proposal_created: '📝',
  proposal_sent: '📨',
  proposal_accepted: '🎉',
  proposal_rejected: '❌',
  note_added: '📌',
  closed: '✅',
  lost: '❌',
}

export default function AdminLeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [lead, setLead] = useState<Lead | null>(null)
  const [quote, setQuote] = useState<QuoteEstimate | null>(null)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [completingTask, setCompletingTask] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const backfillDone = useRef(false)

  useEffect(() => {
    if (!leadId) return
    const unsub = subscribeLeadById(TENANT, leadId, (l) => {
      if (l) {
        setLead(l)
        setNotes(l.internalNotes ?? '')
        setLoading(false)
      }
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
    const unsub = subscribeLeadTimeline(TENANT, leadId, setTimeline)
    return unsub
  }, [leadId])

  useEffect(() => {
    if (!leadId) return
    const unsub = subscribeLeadProposals(TENANT, leadId, setProposals)
    return unsub
  }, [leadId])

  useEffect(() => {
    if (!leadId) return
    const unsub = subscribeTasksByLead(TENANT, leadId, setTasks)
    return unsub
  }, [leadId])

  // legacyBackfill: apenas para leads antigos sem timeline (criados antes do fluxo de serviço gerar a timeline automaticamente)
  useEffect(() => {
    if (!lead || !leadId || backfillDone.current) return
    if (timeline.length > 0 || !lead.quoteEstimateId) return
    backfillDone.current = true
    const legacyBackfill = async () => {
      await createTimelineEvent(TENANT, leadId, {
        type: 'quote_created',
        title: 'Estimativa criada pelo cliente',
        visibility: 'customer',
        createdBy: lead.customerUid,
      })
      await createTimelineEvent(TENANT, leadId, {
        type: 'lead_created',
        title: 'Solicitação criada a partir da estimativa',
        visibility: 'customer',
        createdBy: lead.customerUid,
      })
    }
    legacyBackfill()
  }, [lead, leadId, timeline])

  async function handleStatusChange(status: LeadStatus) {
    if (!leadId || !lead) return
    setChangingStatus(true)
    try {
      await updateLeadStatusWithTimeline(TENANT, leadId, status, lead.status, user?.uid)
    } finally {
      setChangingStatus(false)
    }
  }

  async function handleSaveNotes() {
    if (!lead) return
    setSavingNotes(true)
    try {
      await updateLeadNotes(lead, notes)
      await createTimelineEvent(TENANT, lead.id, {
        type: 'note_added',
        title: 'Observação interna atualizada',
        visibility: 'internal',
        createdBy: user?.uid,
      })
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    } finally {
      setSavingNotes(false)
    }
  }

  async function handleCompleteTask(task: Task) {
    setCompletingTask(task.id)
    try {
      await completeTask(TENANT, task.id)
      if (leadId) {
        await createTimelineEvent(TENANT, leadId, {
          type: 'note_added',
          title: 'Tarefa concluída',
          description: task.title,
          visibility: 'internal',
          createdBy: user?.uid,
        })
      }
    } finally {
      setCompletingTask(null)
    }
  }

  async function handleCreateTask(data: TaskFormValues) {
    if (!leadId) return
    const dueAt = data.dueAt ? Timestamp.fromDate(new Date(data.dueAt)) : undefined
    await createTask(TENANT, {
      type: data.type,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      leadId,
      customerUid: lead?.customerUid,
      ...(dueAt ? { dueAt } : {}),
    }, user?.uid)
    setShowTaskForm(false)
  }

  async function handleCreateProposal(data: ProposalFormData) {
    if (!leadId) return
    await createProposal(TENANT, data, user?.uid)
    setShowProposalForm(false)
  }

  async function handleSendProposal(proposal: Proposal) {
    if (!leadId || !lead) return
    await sendProposal(TENANT, proposal.id, leadId, user?.uid)
    await updateLeadStatusWithTimeline(TENANT, leadId, 'proposta_enviada', lead.status, user?.uid)
  }

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        </AdminLayout>
      </AdminRoute>
    )
  }

  if (!lead) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="py-20 text-center text-neutral-500">Pedido não encontrado.</div>
        </AdminLayout>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <AdminLayout>
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/pedidos')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-neutral-950">{lead.name}</h1>
            <p className="mt-0.5 text-sm text-neutral-500">{lead.phone} · {lead.city}</p>
          </div>
          <a
            href={whatsappLinkForLead(lead.phone, lead.name)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* Status comercial */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status comercial</h2>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={changingStatus}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      lead.status === s
                        ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-neutral-950'
                        : STATUS_COLORS[s] + ' opacity-50 hover:opacity-100'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleStatusChange('fechado')}
                  disabled={changingStatus || lead.status === 'fechado'}
                  className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-40"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Marcar como fechado
                </button>
                <button
                  onClick={() => handleStatusChange('perdido')}
                  disabled={changingStatus || lead.status === 'perdido'}
                  className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Marcar como perdido
                </button>
              </div>
            </section>

            {/* Dados do cliente */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Dados do cliente</h2>
              <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-100 bg-neutral-50">
                {[
                  { label: 'Nome', value: lead.name },
                  { label: 'Telefone', value: lead.phone },
                  { label: 'Cidade', value: lead.city },
                  { label: 'Bairro', value: lead.neighborhood || '—' },
                  { label: 'Serviço', value: lead.serviceType },
                  { label: 'Descrição', value: lead.description || '—' },
                  { label: 'Orçamento', value: lead.budgetRange || '—' },
                  { label: 'Prazo', value: lead.desiredTimeline || '—' },
                  { label: 'Origem', value: lead.source },
                  { label: 'Criado em', value: formatDate(lead.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 px-4 py-2.5">
                    <p className="w-32 shrink-0 text-xs font-medium text-neutral-500">{label}</p>
                    <p className="break-all text-sm text-neutral-900">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Estimativa vinculada */}
            {quote && (
              <section className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Estimativa vinculada</h2>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold text-blue-900">{quote.serviceType}</p>
                  </div>
                  <p className="mt-2 text-sm text-blue-800">
                    {formatCurrency(quote.calculation.estimatedLow)} – {formatCurrency(quote.calculation.estimatedHigh)}
                  </p>
                  <p className="mt-1 text-xs text-blue-600">
                    {quote.inputs.areaM2 ? `${quote.inputs.areaM2} m² · ` : ''}
                    Confiança {quote.calculation.confidence} · {formatDateShort(quote.createdAt)}
                  </p>
                </div>
              </section>
            )}

            {/* Agendamento vinculado */}
            {appointment && (
              <section className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Agendamento vinculado</h2>
                <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-purple-600" />
                      <p className="font-semibold text-purple-900">{appointment.date} às {appointment.startTime}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 text-xs">
                      {APPOINTMENT_STATUS_LABELS[appointment.status]}
                    </Badge>
                  </div>
                  {appointment.address && (
                    <p className="mt-1.5 text-sm text-purple-700">{appointment.address}</p>
                  )}
                  <p className="mt-1 text-xs text-purple-600">{appointment.city} · {appointment.neighborhood}</p>
                </div>
              </section>
            )}

            {/* Propostas */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Propostas</h2>
                {!showProposalForm && (
                  <button
                    onClick={() => setShowProposalForm(true)}
                    className="flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-950"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nova proposta
                  </button>
                )}
              </div>

              {showProposalForm && (
                <ProposalForm
                  leadId={lead.id}
                  customerUid={lead.customerUid}
                  quoteEstimateId={lead.quoteEstimateId}
                  onSubmit={handleCreateProposal}
                  onCancel={() => setShowProposalForm(false)}
                />
              )}

              {!showProposalForm && proposals.length === 0 && (
                <p className="text-sm text-neutral-400">Nenhuma proposta criada ainda.</p>
              )}

              {!showProposalForm && proposals.length > 0 && (
                <div className="flex flex-col gap-3">
                  {proposals.map((p) => (
                    <div key={p.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900">{p.title}</p>
                          {p.description && (
                            <p className="mt-0.5 truncate text-sm text-neutral-500">{p.description}</p>
                          )}
                          <p className="mt-1.5 text-lg font-bold text-neutral-950">{formatCurrency(p.total)}</p>
                          <p className="mt-0.5 text-xs text-neutral-400">{formatDateShort(p.createdAt)}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PROPOSAL_STATUS_COLORS[p.status]}`}>
                          {PROPOSAL_STATUS_LABELS[p.status]}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/admin/propostas/${p.id}`)}
                          className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Visualizar
                        </button>
                        {p.status === 'rascunho' && (
                          <button
                            onClick={() => handleSendProposal(p)}
                            className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Enviar ao cliente
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Tarefas */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Tarefas</h2>
                {!showTaskForm && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-950"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nova tarefa
                  </button>
                )}
              </div>

              {showTaskForm && (
                <div className="mb-4">
                  <TaskForm
                    leadId={leadId}
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowTaskForm(false)}
                  />
                </div>
              )}

              {!showTaskForm && tasks.length === 0 && (
                <p className="text-sm text-neutral-400">Nenhuma tarefa para este pedido.</p>
              )}

              {tasks.length > 0 && (
                <div className="flex flex-col gap-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                              {TASK_PRIORITY_LABELS[task.priority]}
                            </span>
                            <span className="text-xs text-neutral-400">{TASK_TYPE_LABELS[task.type]}</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-neutral-900">{task.title}</p>
                          {task.dueAt && (
                            <p className="mt-0.5 text-xs text-neutral-400">
                              Prazo: {formatDateShort(task.dueAt)}
                            </p>
                          )}
                          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                            {TASK_STATUS_LABELS[task.status]}
                          </span>
                        </div>
                        {(task.status === 'open' || task.status === 'in_progress') && (
                          <button
                            onClick={() => handleCompleteTask(task)}
                            disabled={completingTask === task.id}
                            className="shrink-0 rounded-xl bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-60"
                          >
                            Concluir
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Observações internas */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Observações internas</h2>
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setNotesSaved(false) }}
                rows={4}
                placeholder="Notas internas sobre este pedido (não visíveis ao cliente)..."
                className="w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-neutral-950"
              />
              <div className="mt-2 flex items-center gap-3">
                <Button onClick={handleSaveNotes} loading={savingNotes} size="sm">
                  <Save className="h-3.5 w-3.5" />
                  Salvar
                </Button>
                {notesSaved && <span className="text-xs font-medium text-green-600">Salvo!</span>}
              </div>
            </section>
          </div>

          {/* Coluna lateral — Timeline e Resumo */}
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Timeline</h2>
              {timeline.length === 0 ? (
                <p className="text-sm text-neutral-400">Nenhum evento ainda.</p>
              ) : (
                <ol className="relative border-l border-neutral-200">
                  {timeline.map((evt) => (
                    <li key={evt.id} className="mb-5 ml-4">
                      <div className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-white bg-neutral-300" />
                      <div className="flex items-start gap-2">
                        <span className="text-base leading-none">{TIMELINE_ICONS[evt.type] ?? '•'}</span>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{evt.title}</p>
                          {evt.description && (
                            <p className="mt-0.5 text-xs text-neutral-500">{evt.description}</p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-neutral-400">{formatDate(evt.createdAt)}</span>
                            {evt.visibility === 'internal' && (
                              <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">interno</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Resumo</h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Status</span>
                  <Badge className={STATUS_COLORS[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Estimativa</span>
                  <span className="text-neutral-900">{lead.quoteEstimateId ? '✓ Vinculada' : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Agendamento</span>
                  <span className="text-neutral-900">{lead.appointmentId ? '✓ Vinculado' : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Propostas</span>
                  <span className="text-neutral-900">{proposals.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Atualizado</span>
                  <span className="text-neutral-900">{formatDateShort(lead.updatedAt)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}
