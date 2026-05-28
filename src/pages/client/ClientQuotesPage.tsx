import { useEffect, useState } from 'react'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeCustomerQuotes } from '../../services/quoteEstimateService'
import { formatCurrency } from '../../services/quoteCalculator'
import { formatDate } from '../../utils/formatDate'
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '../../types/QuoteEstimate'
import type { QuoteEstimate } from '../../types/QuoteEstimate'

export default function ClientQuotesPage() {
  const { user, currentTenantId } = useAuth()
  const [quotes, setQuotes] = useState<QuoteEstimate[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeCustomerQuotes(
      user.uid,
      currentTenantId,
      (data) => { setQuotes(data); setLoading(false) },
      () => { setLoadError(true); setLoading(false) },
    )
    return unsub
  }, [user, currentTenantId])

  return (
    <CustomerRoute>
      <ClientLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Minhas estimativas</h1>
          <p className="mt-1 text-sm text-neutral-500">{quotes.length} estimativas geradas</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            Não foi possível carregar suas estimativas. Tente recarregar a página.
          </div>
        ) : quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <Calculator className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhuma estimativa ainda</p>
            <p className="mt-1 text-xs text-neutral-400">Use a calculadora de estimativa para ver valores aproximados.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {quotes.map((q) => (
              <div key={q.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-neutral-950">{q.serviceType}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${QUOTE_STATUS_COLORS[q.status]}`}>
                        {QUOTE_STATUS_LABELS[q.status]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">{formatDate(q.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-black text-neutral-950">{formatCurrency(q.calculation.estimatedMid)}</p>
                    {expanded === q.id ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                  </div>
                </button>

                {expanded === q.id && (
                  <div className="border-t border-neutral-100 px-5 py-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-neutral-50 p-3">
                        <p className="text-xs text-neutral-500">Mínimo estimado</p>
                        <p className="mt-0.5 font-bold">{formatCurrency(q.calculation.estimatedLow)}</p>
                      </div>
                      <div className="rounded-xl bg-neutral-50 p-3">
                        <p className="text-xs text-neutral-500">Máximo estimado</p>
                        <p className="mt-0.5 font-bold">{formatCurrency(q.calculation.estimatedHigh)}</p>
                      </div>
                    </div>
                    {q.inputs.areaM2 > 0 && (
                      <p className="mt-3 text-sm text-neutral-600">Área informada: {q.inputs.areaM2} m²</p>
                    )}
                    <p className="mt-2 text-xs text-neutral-400">
                      * Esta é uma estimativa inicial. O valor real depende de visita técnica.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ClientLayout>
    </CustomerRoute>
  )
}
