import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import { useAuth } from '../../contexts/AuthContext'
import { subscribeCustomerAppointments } from '../../services/appointmentService'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../types/Appointment'
import type { Appointment } from '../../types/Appointment'

export default function ClientAppointmentsPage() {
  const { user, currentTenantId } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeCustomerAppointments(user.uid, currentTenantId, (data) => {
      setAppointments(data)
      setLoading(false)
    })
    return unsub
  }, [user, currentTenantId])

  return (
    <CustomerRoute>
      <ClientLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Meus agendamentos</h1>
          <p className="mt-1 text-sm text-neutral-500">{appointments.length} agendamentos</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <Calendar className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhum agendamento ainda</p>
            <p className="mt-1 text-xs text-neutral-400">Solicite uma visita técnica gratuita através do formulário.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-950">{a.serviceType}</p>
                    <p className="mt-0.5 text-sm text-neutral-600">{a.date} às {a.startTime}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{a.city}{a.neighborhood ? ` · ${a.neighborhood}` : ''}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${APPOINTMENT_STATUS_COLORS[a.status]}`}>
                    {APPOINTMENT_STATUS_LABELS[a.status]}
                  </span>
                </div>
                {a.notes && (
                  <p className="mt-3 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">{a.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </ClientLayout>
    </CustomerRoute>
  )
}
