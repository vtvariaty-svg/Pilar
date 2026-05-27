import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Calculator, Calendar, MessageCircle, PlusCircle, ChevronRight } from 'lucide-react'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeCustomerLeads } from '../../services/leadsService'
import { subscribeCustomerQuotes } from '../../services/quoteEstimateService'
import { subscribeCustomerAppointments } from '../../services/appointmentService'
import { formatCurrency } from '../../services/quoteCalculator'
import { formatDate } from '../../utils/formatDate'
import { whatsappLink } from '../../utils/whatsapp'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/Lead'
import { QUOTE_STATUS_LABELS } from '../../types/QuoteEstimate'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../types/Appointment'
import type { Lead } from '../../types/Lead'
import type { QuoteEstimate } from '../../types/QuoteEstimate'
import type { Appointment } from '../../types/Appointment'

export default function ClientDashboard() {
  const { user, userProfile, currentTenantId } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [quotes, setQuotes] = useState<QuoteEstimate[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (!user) return
    const u1 = subscribeCustomerLeads(user.uid, currentTenantId, setLeads)
    const u2 = subscribeCustomerQuotes(user.uid, currentTenantId, setQuotes)
    const u3 = subscribeCustomerAppointments(user.uid, currentTenantId, setAppointments)
    return () => { u1(); u2(); u3() }
  }, [user, currentTenantId])

  const activeLeads = leads.filter((l) => l.status !== 'fechado' && l.status !== 'perdido')
  const nextAppointment = appointments.find((a) => a.status === 'solicitado' || a.status === 'confirmado')

  return (
    <CustomerRoute>
      <ClientLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">
            Olá, {userProfile?.name?.split(' ')[0] ?? 'cliente'} 👋
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Acompanhe seus pedidos e estimativas</p>
        </div>

        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Solicitações', value: leads.length, icon: FileText, to: '/cliente/solicitacoes' },
            { label: 'Estimativas', value: quotes.length, icon: Calculator, to: '/cliente/orcamentos' },
            { label: 'Agendamentos', value: appointments.length, icon: Calendar, to: '/cliente/agendamentos' },
          ].map(({ label, value, icon: Icon, to }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 text-center transition hover:border-neutral-300 hover:shadow-sm"
            >
              <Icon className="h-5 w-5 text-neutral-400" />
              <p className="mt-1 text-2xl font-black text-neutral-950">{value}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{label}</p>
            </Link>
          ))}
        </div>

        {/* Active lead */}
        {activeLeads.length > 0 && (
          <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-950">Solicitações ativas</p>
              <Link to="/cliente/solicitacoes" className="text-xs text-neutral-500 hover:underline">Ver todas</Link>
            </div>
            <ul className="flex flex-col gap-2">
              {activeLeads.slice(0, 3).map((l) => (
                <li key={l.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{l.serviceType}</p>
                    <p className="text-xs text-neutral-500">{formatDate(l.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[l.status]}`}>
                    {STATUS_LABELS[l.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Latest quote */}
        {quotes.length > 0 && (
          <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-950">Última estimativa</p>
              <Link to="/cliente/orcamentos" className="text-xs text-neutral-500 hover:underline">Ver todas</Link>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-3">
              <div>
                <p className="font-semibold text-neutral-950">{quotes[0].serviceType}</p>
                <p className="text-xs text-neutral-500">{QUOTE_STATUS_LABELS[quotes[0].status]}</p>
              </div>
              <p className="text-lg font-black text-neutral-950">{formatCurrency(quotes[0].calculation.estimatedMid)}</p>
            </div>
          </div>
        )}

        {/* Next appointment */}
        {nextAppointment && (
          <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="mb-2 text-sm font-bold text-neutral-950">Próximo agendamento</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-800">{nextAppointment.serviceType}</p>
                <p className="text-sm text-neutral-500">{nextAppointment.date} às {nextAppointment.startTime}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${APPOINTMENT_STATUS_COLORS[nextAppointment.status]}`}>
                {APPOINTMENT_STATUS_LABELS[nextAppointment.status]}
              </span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            to="/orcamento"
            className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-950">Calcular nova estimativa</p>
                <p className="text-xs text-neutral-500">Veja um valor aproximado da sua obra</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </Link>
          <Link
            to="/#orcamento"
            className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-950">Nova solicitação de orçamento</p>
                <p className="text-xs text-neutral-500">Envie detalhes do seu projeto</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </Link>
          <a
            href={whatsappLink('Olá, sou cliente e gostaria de tirar uma dúvida sobre meu pedido.')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-950">Falar pelo WhatsApp</p>
                <p className="text-xs text-neutral-500">Suporte rápido</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </a>
        </div>
      </ClientLayout>
    </CustomerRoute>
  )
}
