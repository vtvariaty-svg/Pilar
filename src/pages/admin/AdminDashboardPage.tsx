import { useEffect, useState } from 'react'
import { Users, Calculator, Calendar, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { subscribeLeads } from '../../services/leadsService'
import { subscribeQuoteEstimates } from '../../services/quoteEstimateService'
import { subscribeAppointments } from '../../services/appointmentService'
import { formatCurrency } from '../../services/quoteCalculator'
import type { Lead } from '../../types/Lead'
import type { QuoteEstimate } from '../../types/QuoteEstimate'
import type { Appointment } from '../../types/Appointment'

interface StatCardProps {
  icon: typeof Users
  label: string
  value: string | number
  sub?: string
  color?: string
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-neutral-950' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
          <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>}
        </div>
        <div className="rounded-xl bg-neutral-100 p-2.5">
          <Icon className="h-5 w-5 text-neutral-600" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [quotes, setQuotes] = useState<QuoteEstimate[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const u1 = subscribeLeads(setLeads)
    const u2 = subscribeQuoteEstimates(setQuotes)
    const u3 = subscribeAppointments(setAppointments)
    return () => { u1(); u2(); u3() }
  }, [])

  const newLeads = leads.filter((l) => l.status === 'novo').length
  const closedLeads = leads.filter((l) => l.status === 'fechado').length
  const lostLeads = leads.filter((l) => l.status === 'perdido').length
  const conversionRate = leads.length > 0 ? Math.round((closedLeads / leads.length) * 100) : 0

  const closedQuotes = quotes.filter((q) => q.status === 'fechado')
  const avgTicket = closedQuotes.length > 0
    ? closedQuotes.reduce((acc, q) => acc + q.calculation.estimatedMid, 0) / closedQuotes.length
    : 0

  const pendingAppointments = appointments.filter((a) => a.status === 'solicitado' || a.status === 'confirmado').length

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">VisÃ£o geral da plataforma</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Total de leads" value={leads.length} sub={`${newLeads} novos`} />
          <StatCard icon={Calculator} label="Estimativas" value={quotes.length} sub="via calculadora" />
          <StatCard icon={Calendar} label="Visitas pendentes" value={pendingAppointments} sub="agendadas" />
          <StatCard icon={TrendingUp} label="ConversÃ£o" value={`${conversionRate}%`} sub={`${closedLeads} fechados`} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard icon={CheckCircle2} label="Propostas enviadas" value={leads.filter((l) => l.status === 'proposta_enviada').length} color="text-orange-600" />
          <StatCard icon={XCircle} label="Perdidos" value={lostLeads} color="text-red-600" />
          <StatCard icon={Clock} label="Ticket mÃ©dio estimado" value={avgTicket > 0 ? formatCurrency(avgTicket) : 'â€”'} sub={`${closedQuotes.length} fechados`} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Recent leads */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-neutral-950">Leads recentes</h2>
            {leads.length === 0 ? (
              <p className="text-sm text-neutral-400">Nenhum lead ainda.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {leads.slice(0, 5).map((l) => (
                  <li key={l.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{l.name}</p>
                      <p className="text-xs text-neutral-500">{l.serviceType} Â· {l.city}</p>
                    </div>
                    <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">{l.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent quotes */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-neutral-950">Estimativas recentes</h2>
            {quotes.length === 0 ? (
              <p className="text-sm text-neutral-400">Nenhuma estimativa ainda.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {quotes.slice(0, 5).map((q) => (
                  <li key={q.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{q.client.name}</p>
                      <p className="text-xs text-neutral-500">{q.serviceType} Â· {q.client.city}</p>
                    </div>
                    <span className="text-sm font-bold text-neutral-950">{formatCurrency(q.calculation.estimatedMid)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}

