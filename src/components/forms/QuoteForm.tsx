import { useState, useEffect, type FormEvent } from 'react'
import { MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { createLead } from '../../services/leadsService'
import { whatsappLinkFromLead } from '../../utils/whatsapp'
import { useAuth } from '../../contexts/AuthContext'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { serviceTypeOptions } from '../../data/services'

const budgetOptions = [
  'Até R$ 5.000',
  'R$ 5.000 a R$ 15.000',
  'R$ 15.000 a R$ 50.000',
  'R$ 50.000 a R$ 100.000',
  'Acima de R$ 100.000',
  'Ainda não sei',
]

const timelineOptions = [
  'O mais rápido possível',
  'Em até 1 mês',
  'Em 1 a 3 meses',
  'Em 3 a 6 meses',
  'Sem prazo definido',
]

interface FormState {
  name: string
  phone: string
  city: string
  neighborhood: string
  serviceType: string
  description: string
  budgetRange: string
  desiredTimeline: string
  notes: string
}

const initial: FormState = {
  name: '',
  phone: '',
  city: '',
  neighborhood: '',
  serviceType: serviceTypeOptions[0],
  description: '',
  budgetRange: budgetOptions[5],
  desiredTimeline: timelineOptions[4],
  notes: '',
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = 'Nome é obrigatório'
  if (!form.phone.trim()) errors.phone = 'Telefone é obrigatório'
  if (!form.city.trim()) errors.city = 'Cidade é obrigatória'
  if (!form.description.trim()) errors.description = 'Descreva o serviço desejado'
  return errors
}

export default function QuoteForm() {
  const { user, userProfile } = useAuth()
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  useEffect(() => {
    if (userProfile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || userProfile.name || '',
        phone: prev.phone || userProfile.phone || '',
      }))
    }
  }, [userProfile])

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await createLead(form, { customerUid: user?.uid })
      const url = whatsappLinkFromLead(form)
      setWhatsappUrl(url)
      setSubmitted(true)
    } catch {
      alert('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl text-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-black text-neutral-950">Pedido enviado com sucesso!</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Recebemos sua solicitação e entraremos em contato em até 24h úteis. Para agilizar, continue a conversa pelo WhatsApp.
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          Continuar pelo WhatsApp
          <ArrowRight className="h-4 w-4" />
        </a>
        <button
          onClick={() => { setSubmitted(false); setForm(initial) }}
          className="text-xs text-neutral-500 hover:text-neutral-700"
        >
          Enviar outro pedido
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome *" placeholder="Seu nome completo" value={form.name}
          onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <Input label="Telefone / WhatsApp *" placeholder="(00) 00000-0000" value={form.phone}
          onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input label="Cidade *" placeholder="Ex.: Campinas" value={form.city}
          onChange={(e) => set('city', e.target.value)} error={errors.city} />
        <Input label="Bairro" placeholder="Ex.: Centro" value={form.neighborhood}
          onChange={(e) => set('neighborhood', e.target.value)} />
      </div>

      <div className="mt-4">
        <Select label="Tipo de serviço" options={[...serviceTypeOptions]} value={form.serviceType}
          onChange={(e) => set('serviceType', e.target.value)} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Select label="Faixa de orçamento" options={budgetOptions} value={form.budgetRange}
          onChange={(e) => set('budgetRange', e.target.value)} />
        <Select label="Prazo desejado" options={timelineOptions} value={form.desiredTimeline}
          onChange={(e) => set('desiredTimeline', e.target.value)} />
      </div>

      <div className="mt-4">
        <Textarea label="Descreva o que deseja fazer *"
          placeholder="Ex.: Quero reformar a cozinha, trocar piso, mexer na hidráulica e pintar."
          rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
          error={errors.description} />
      </div>

      <div className="mt-4">
        <Textarea label="Observações" placeholder="Informações adicionais, restrições, preferências..."
          rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>

      <Button type="submit" loading={loading} size="lg" className="mt-5 w-full">
        <MessageCircle className="h-4 w-4" />
        Enviar pedido de orçamento
      </Button>

      <p className="mt-4 text-xs leading-5 text-neutral-500">
        Campos marcados com * são obrigatórios. Após o envio, entraremos em contato em até 24h úteis.
      </p>
    </form>
  )
}
