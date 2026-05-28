import { useState, type FormEvent } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { HardHat, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { env } from '../utils/env'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { claimQuoteForCustomer } from '../services/quoteEstimateService'
import { convertQuoteToLead } from '../services/commercialFlowService'

interface LocationState {
  from?: string
  quoteId?: string
}

export default function SignUp() {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) { navigate('/cliente', { replace: true }); return null }

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nome é obrigatório.'); return }
    if (!form.email.trim()) { setError('E-mail é obrigatório.'); return }
    if (!form.phone.trim()) { setError('Telefone é obrigatório.'); return }
    if (form.password.length < 6) { setError('Senha deve ter ao menos 6 caracteres.'); return }
    if (form.password !== form.confirm) { setError('As senhas não conferem.'); return }
    setLoading(true)
    try {
      const uid = await signUp(form.email, form.password, { name: form.name, phone: form.phone })

      if (state.quoteId) {
        try {
          await claimQuoteForCustomer('pilar', state.quoteId, uid)
          const leadId = await convertQuoteToLead(state.quoteId, 'pilar', uid)
          navigate(`/cliente/solicitacoes/${leadId}`, { replace: true })
        } catch {
          navigate('/cliente', { replace: true })
        }
      } else {
        navigate('/cliente', { replace: true })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('email-already-in-use')) setError('Este e-mail já está em uso.')
      else setError('Erro ao criar conta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg">
            <HardHat className="h-7 w-7" />
          </Link>
          <h1 className="mt-4 text-xl font-black text-neutral-950">{env.companyName}</h1>
          <p className="mt-1 text-sm text-neutral-500">Crie sua conta e acompanhe seus pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl">
          <div className="flex flex-col gap-4">
            <Input label="Nome completo *" placeholder="Seu nome" value={form.name}
              onChange={(e) => set('name', e.target.value)} autoComplete="name" />
            <Input label="E-mail *" type="email" placeholder="seu@email.com" value={form.email}
              onChange={(e) => set('email', e.target.value)} autoComplete="email" />
            <Input label="Telefone / WhatsApp *" placeholder="(00) 00000-0000" value={form.phone}
              onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
            <Input label="Senha *" type="password" placeholder="Mínimo 6 caracteres" value={form.password}
              onChange={(e) => set('password', e.target.value)} autoComplete="new-password" />
            <Input label="Confirmar senha *" type="password" placeholder="Repita a senha" value={form.confirm}
              onChange={(e) => set('confirm', e.target.value)} autoComplete="new-password" />
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <Button type="submit" loading={loading} size="lg" className="mt-5 w-full">
            <UserPlus className="h-4 w-4" />
            Criar conta
          </Button>

          <p className="mt-4 text-center text-xs text-neutral-500">
            Já tem conta?{' '}
            <Link to="/entrar" className="font-semibold text-neutral-950 underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
