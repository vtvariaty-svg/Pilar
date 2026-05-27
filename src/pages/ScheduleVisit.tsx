import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { HardHat, Calendar, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { createAppointment } from '../services/appointmentService'
import { env } from '../utils/env'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

interface LocationState {
  clientName?: string
  phone?: string
  city?: string
  neighborhood?: string
  serviceType?: string
  quoteEstimateId?: string
}

export default function ScheduleVisit() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const state = (location.state as LocationState) ?? {}

  const [form, setForm] = useState({
    clientName: state.clientName ?? '',
    phone: state.phone ?? '',
    city: state.city ?? '',
    neighborhood: state.neighborhood ?? '',
    serviceType: state.serviceType ?? '',
    date: '',
    startTime: '09:00',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function patch(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.clientName || !form.phone || !form.serviceType || !form.date) {
      setError('Preencha nome, telefone, serviço e data.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createAppointment({
        clientName: form.clientName,
        phone: form.phone,
        city: form.city,
        neighborhood: form.neighborhood,
        serviceType: form.serviceType,
        date: form.date,
        startTime: form.startTime,
        notes: form.notes,
        quoteEstimateId: state.quoteEstimateId,
        customerUid: user?.uid,
      })
      setDone(true)
    } catch {
      setError('Erro ao enviar agendamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-xl font-black text-neutral-950">Visita solicitada!</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Entraremos em contato em breve para confirmar o agendamento.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <Link
                to="/cliente/agendamentos"
                className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Ver meus agendamentos
              </Link>
            ) : (
              <Link
                to="/criar-conta"
                className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Criar conta para acompanhar
              </Link>
            )}
            <button
              onClick={() => navigate('/')}
              className="text-sm text-neutral-400 underline hover:text-neutral-600"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <HardHat className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-neutral-950">{env.companyName}</span>
          </button>
          <p className="text-sm text-neutral-500">Agendar visita técnica</p>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
            <Calendar className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <h1 className="text-lg font-black text-neutral-950">Agendar visita técnica gratuita</h1>
            <p className="text-sm text-neutral-500">Sem compromisso · Gratuita</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <Input
              label="Seu nome"
              value={form.clientName}
              onChange={(e) => patch('clientName', e.target.value)}
              placeholder="Nome completo"
            />
            <Input
              label="Telefone / WhatsApp"
              value={form.phone}
              onChange={(e) => patch('phone', e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cidade"
                value={form.city}
                onChange={(e) => patch('city', e.target.value)}
                placeholder="Sua cidade"
              />
              <Input
                label="Bairro"
                value={form.neighborhood}
                onChange={(e) => patch('neighborhood', e.target.value)}
                placeholder="Bairro"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Tipo de serviço</label>
              <input
                value={form.serviceType}
                onChange={(e) => patch('serviceType', e.target.value)}
                placeholder="Ex: Reforma, Construção..."
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Data preferida</label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => patch('date', e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Horário</label>
                <select
                  value={form.startTime}
                  onChange={(e) => patch('startTime', e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
                >
                  {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Observações (opcional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => patch('notes', e.target.value)}
                rows={3}
                placeholder="Descreva brevemente o que precisa ser feito..."
                className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
              />
            </div>
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <Button type="submit" loading={loading} size="lg" className="mt-5 w-full">
            <Calendar className="h-4 w-4" />
            Solicitar visita
          </Button>

          {!user && (
            <p className="mt-3 text-center text-xs text-neutral-400">
              Tem conta?{' '}
              <Link to="/entrar" className="font-semibold text-neutral-700 underline">
                Entre para acompanhar o pedido
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
