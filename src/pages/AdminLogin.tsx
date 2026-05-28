import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'

export default function AdminLogin() {
  const { signIn, logout, user, loading, isAdminUser, isPlatformAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading || !user) return

    if (isPlatformAdmin) {
      setSubmitting(false)
      navigate('/admin/sistema', { replace: true })
      return
    }

    if (isAdminUser) {
      setSubmitting(false)
      navigate('/admin/dashboard', { replace: true })
      return
    }

    if (user.email === 'vtvariaty@gmail.com') {
      setSubmitting(false)
      navigate('/admin/bootstrap', { replace: true })
      return
    }

    setSubmitting(false)
    logout().then(() => setError('Sua conta não tem acesso ao painel administrativo.'))
  }, [loading, user, isAdminUser, isPlatformAdmin, navigate, logout])

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

  const inputClass = 'w-full border border-[#2a2a28] bg-[#111110] px-4 py-3 text-sm text-brand-offwhite placeholder-brand-limestone/30 outline-none focus:border-brand-gold/50 transition'

  return (
    <AuthLayout
      title="Painel administrativo."
      subtitle="Acesso restrito para gestão da operação Pilar."
      mode="admin"
      footer={
        <div className="flex flex-col gap-2 text-center">
          <Link
            to="/"
            className="text-xs text-brand-limestone/30 hover:text-brand-limestone/60 transition"
          >
            Voltar ao site
          </Link>
          <Link
            to="/entrar"
            className="text-xs text-brand-limestone/30 hover:text-brand-limestone/60 transition"
          >
            Área do cliente
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-limestone/50">
            E-mail administrativo
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@pilar.com.br"
            autoComplete="email"
            className={inputClass}
          />
        </div>

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
          {submitting ? 'Verificando...' : 'Acessar painel'}
        </button>
      </form>
    </AuthLayout>
  )
}
