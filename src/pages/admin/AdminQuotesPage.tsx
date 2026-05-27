import { useEffect, useState } from 'react'
import { Calculator, ChevronRight, X } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import ProtectedRoute from '../../components/admin/ProtectedRoute'
import { subscribeQuoteEstimates, updateQuoteStatus } from '../../services/quoteEstimateService'
import { formatCurrency } from '../../services/quoteCalculator'
import { formatDate } from '../../utils/formatDate'
import type { QuoteEstimate, QuoteStatus } from '../../types/QuoteEstimate'
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '../../types/QuoteEstimate'

const STATUS_OPTIONS: QuoteStatus[] = [
  'estimativa_criada', 'aguardando_contato', 'visita_solicitada',
  'em_atendimento', 'proposta_enviada', 'fechado', 'perdido',
]

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteEstimate[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<QuoteEstimate | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'todos'>('todos')

  useEffect(() => {
    const unsub = subscribeQuoteEstimates((data) => {
      setQuotes(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = quotes.filter((q) => {
    const matchSearch =
      !search ||
      q.client.name.toLowerCase().includes(search.toLowerCase()) ||
      q.client.city.toLowerCase().includes(search.toLowerCase()) ||
      q.serviceType.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || q.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleStatusChange(id: string, status: QuoteStatus) {
    await updateQuoteStatus(id, status)
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null)
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Estimativas</h1>
          <p className="mt-1 text-sm text-neutral-500">{quotes.length} estimativas via calculadora</p>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, cidade ou serviço..."
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | 'todos')}
            className="rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          >
            <option value="todos">Todos os status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{QUOTE_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <Calculator className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhuma estimativa encontrada</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelected(q)}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left transition hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-950">{q.client.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${QUOTE_STATUS_COLORS[q.status]}`}>
                      {QUOTE_STATUS_LABELS[q.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-500">{q.serviceType} · {q.client.city}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-neutral-950">{formatCurrency(q.calculation.estimatedMid)}</p>
                    <p className="text-xs text-neutral-400">{formatDate(q.createdAt)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Detail panel */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
            <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 sm:rounded-3xl max-h-[90vh] overflow-y-auto">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-black text-neutral-950">{selected.client.name}</h2>
                  <p className="text-sm text-neutral-500">{selected.serviceType}</p>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-xl p-2 hover:bg-neutral-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Estimativa provável</p>
                  <p className="mt-0.5 text-lg font-black">{formatCurrency(selected.calculation.estimatedMid)}</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Faixa</p>
                  <p className="mt-0.5 text-sm font-semibold">{formatCurrency(selected.calculation.estimatedLow)} – {formatCurrency(selected.calculation.estimatedHigh)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Contato</p>
                <p className="text-sm"><span className="font-medium">Telefone:</span> {selected.client.phone}</p>
                <p className="text-sm"><span className="font-medium">Cidade:</span> {selected.client.city}{selected.client.neighborhood ? ` · ${selected.client.neighborhood}` : ''}</p>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Detalhes</p>
                {selected.inputs.areaM2 > 0 && <p className="text-sm">Área: {selected.inputs.areaM2} m²</p>}
                <p className="text-sm">Padrão: {selected.inputs.finishStandard}</p>
                <p className="text-sm">Complexidade: {selected.inputs.complexity}</p>
                <p className="text-sm">Prazo: {selected.inputs.timeline}</p>
                {selected.inputs.notes && <p className="mt-1 text-sm text-neutral-600">Obs: {selected.inputs.notes}</p>}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</p>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value as QuoteStatus)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{QUOTE_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}
