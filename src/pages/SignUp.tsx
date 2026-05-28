import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../services/firebase'
import AuthLayout from '../components/auth/AuthLayout'
import { claimQuoteForCustomer } from '../services/quoteEstimateService'
import { convertQuoteToLead } from '../services/commercialFlowService'

interface LocationState {
  from?: string
  quoteId?: string
}

export default function SignUp() {
  const { signUp, user, loading, isAdminUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading || !user) return
    if (isAdminUser) { navigate('/admin/dashboard', { replace: true }); return }
    navigate('/cliente', { replace: true })
  }, [loading, user, isAdminUser, navigate])

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
    setSubmitting(true)
    try {
      const uid = await signUp(form.email, form.password, { name: form.name, phone: form.phone })

      const adminSnap = await getDoc(doc(db, 'adminUsers', uid))
      if (adminSnap.exists() && adminSnap.data().active === true) {
        navigate('/admin/dashboard', { replace: true })
        return
      }

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
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full border border-[#2a2a28] bg-[#111110] px-4 py-3 text-sm text-brand-offwhite placeholder-brand-limestone/30 outline-none focus:border-brand-gold/50 transition'

  return (
    <AuthLayout
      title="Crie sua área do cliente."
      subtitle="Acompanhe estimativas, visitas, propostas e solicitações em um só lugar."
      mode="client"
      footer={
        <p className="text-center text-xs text-brand-limestone/40">
          Já tem conta?{' '}
          <Link to="/entrar" className="text-brand-gold hover:text-brand-limestone transition">
            Entrar
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">Nome completo</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">WhatsApp</label>
          <input
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">Senha</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">Confirmar senha</label>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => set('confirm', e.target.value)}
            placeholder="Repita a senha"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="border border-red-700/30 bg-red-900/20 px-4 py-3 text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-brand-gold bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-dark transition hover:bg-[#c9a76a] disabled:opacity-50"
        >
          {submitting ? 'Criando conta...' : 'Criar conta gratuita'}
        </button>

        <p className="text-center text-xs text-brand-limestone/30">
          Você poderá acompanhar suas solicitações e propostas na área do cliente.
        </p>
      </form>
    </AuthLayout>
  )
}
