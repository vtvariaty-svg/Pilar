import { useEffect, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { subscribeAppointments, updateAppointmentStatus, updateAppointmentNotes } from '../../services/appointmentService'
import { formatDate } from '../../utils/formatDate'
import type { Appointment, AppointmentStatus } from '../../types/Appointment'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../../types/Appointment'

const STATUS_OPTIONS: AppointmentStatus[] = ['solicitado', 'confirmado', 'remarcado', 'cancelado', 'realizado']

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    const unsub = subscribeAppointments((data) => {
      setAppointments(data)
      setLoading(false)
    })
    return unsub
  }, [])

  function openDetail(a: Appointment) {
    setSelected(a)
    setNotes(a.internalNotes ?? '')
  }

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    await updateAppointmentStatus(id, status)
    setSelected((prev) => prev ? { ...prev, status } : null)
  }

  async function handleSaveNotes() {
    if (!selected) return
    setSavingNotes(true)
    await updateAppointmentNotes(selected.id, notes)
    setSavingNotes(false)
  }

  const pending = appointments.filter((a) => a.status === 'solicitado' || a.status === 'confirmado')
  const past = appointments.filter((a) => a.status === 'realizado' || a.status === 'cancelado')

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Agendamentos</h1>
          <p className="mt-1 text-sm text-neutral-500">{appointments.length} total Â· {pending.length} pendentes</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <Calendar className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhum agendamento ainda</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pending.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-bold text-neutral-700">Pendentes / Confirmados</p>
                <div className="flex flex-col gap-2">
                  {pending.map((a) => (
                    <AppointmentRow key={a.id} appointment={a} onClick={() => openDetail(a)} />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-bold text-neutral-700">Realizados / Cancelados</p>
                <div className="flex flex-col gap-2">
                  {past.map((a) => (
                    <AppointmentRow key={a.id} appointment={a} onClick={() => openDetail(a)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
            <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 sm:rounded-3xl max-h-[90vh] overflow-y-auto">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-black text-neutral-950">{selected.clientName}</h2>
                  <p className="text-sm text-neutral-500">{selected.serviceType} Â· {selected.date} {selected.startTime}</p>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-xl p-2 hover:bg-neutral-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Telefone:</span> {selected.phone}</div>
                <div><span className="font-medium">Cidade:</span> {selected.city}</div>
                {selected.neighborhood && <div><span className="font-medium">Bairro:</span> {selected.neighborhood}</div>}
                {selected.address && <div className="col-span-2"><span className="font-medium">EndereÃ§o:</span> {selected.address}</div>}
                <div><span className="font-medium">Criado em:</span> {formatDate(selected.createdAt)}</div>
              </div>

              {selected.notes && (
                <div className="mb-4 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-700">
                  <p className="mb-1 text-xs font-semibold text-neutral-400">ObservaÃ§Ãµes do cliente</p>
                  {selected.notes}
                </div>
              )}

              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</p>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value as AppointmentStatus)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{APPOINTMENT_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Notas internas</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
                  placeholder="AnotaÃ§Ãµes internas sobre esta visita..."
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="mt-2 rounded-xl bg-neutral-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
                >
                  {savingNotes ? 'Salvando...' : 'Salvar notas'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  )
}

function AppointmentRow({ appointment: a, onClick }: { appointment: Appointment; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left transition hover:border-neutral-300 hover:shadow-sm"
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-neutral-950">{a.clientName}</p>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${APPOINTMENT_STATUS_COLORS[a.status]}`}>
            {APPOINTMENT_STATUS_LABELS[a.status]}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-neutral-500">{a.serviceType} Â· {a.city}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-neutral-950">{a.date}</p>
        <p className="text-xs text-neutral-400">{a.startTime}</p>
      </div>
    </button>
  )
}

