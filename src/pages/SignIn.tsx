import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'

export default function SignIn() {
  const { signIn, isTenantStaff, isPlatformAdmin, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    if (loading || !user) return
    if (isPlatformAdmin) { navigate('/admin/sistema', { replace: true }); return }
    if (isTenantStaff) { navigate('/admin/dashboard', { replace: true }); return }
    navigate('/cliente', { replace: true })
  }, [loading, user, isPlatformAdmin, isTenantStaff, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Preencha e-mail e senha.'); return }
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch {
      setError('E-mail ou senha incorretos.')
      setSubmitting(false)
    }
  }

  async function handlePasswordReset(e: FormEvent) {
    e.preventDefault()
    if (!email) { setError('Informe seu e-mail acima para recuperar a senha.'); return }
    setSubmitting(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
      setShowReset(false)
    } catch {
      setError('Não foi possível enviar o e-mail. Verifique o endereço informado.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full border border-[#2a2a28] bg-[#111110] px-4 py-3 text-sm text-brand-offwhite placeholder-brand-limestone/30 outline-none focus:border-brand-gold/50 transition'

  return (
    <AuthLayout
      title="Acesse sua área do cliente."
      subtitle="Acompanhe estimativas, visitas e propostas da sua obra."
      mode="client"
      footer={
        <p className="text-center text-xs text-brand-limestone/40">
          Ainda não tem conta?{' '}
          <Link to="/criar-conta" className="text-brand-gold hover:text-brand-limestone transition">
            Criar conta gratuita
          </Link>
        </p>
      }
    >
      {resetSent && (
        <div className="mb-6 border border-green-700/30 bg-green-900/20 px-4 py-3 text-sm text-green-400">
          E-mail de redefinição enviado. Verifique sua caixa de entrada.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            className={inputClass}
          />
        </div>

        {!showReset && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
        )}

        {error && (
          <p className="border border-red-700/30 bg-red-900/20 px-4 py-3 text-xs text-red-400">
            {error}
          </p>
        )}

        {!showReset ? (
          <>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 border border-brand-gold bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-dark transition hover:bg-[#c9a76a] disabled:opacity-50"
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </button>

            <button
              type="button"
              onClick={() => { setShowReset(true); setError('') }}
              className="text-center text-xs text-brand-limestone/40 hover:text-brand-limestone/70 transition"
            >
              Esqueci minha senha
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={submitting}
              className="mt-2 border border-brand-gold bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-dark transition hover:bg-[#c9a76a] disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Enviar link de redefinição'}
            </button>
            <button
              type="button"
              onClick={() => { setShowReset(false); setError('') }}
              className="text-center text-xs text-brand-limestone/40 hover:text-brand-limestone/70 transition"
            >
              Voltar ao login
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  )
}
