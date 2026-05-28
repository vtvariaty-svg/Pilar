import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HardHat, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { env } from '../utils/env'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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
      navigate('/platform', { replace: true })
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg">
            <HardHat className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-black text-neutral-950">{env.companyName}</h1>
          <p className="mt-1 text-sm text-neutral-500">Painel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl">
          <div className="flex flex-col gap-4">
            <Input label="E-mail" type="email" placeholder="admin@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <Input label="Senha" type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <Button type="submit" loading={submitting} size="lg" className="mt-5 w-full">
            <LogIn className="h-4 w-4" />
            Entrar
          </Button>

          <p className="mt-4 text-center text-xs text-neutral-500">
            <Link to="/entrar" className="text-neutral-950 underline">Usar a página de login padrão</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
