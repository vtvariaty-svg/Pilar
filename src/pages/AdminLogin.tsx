import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { HardHat, LogIn } from 'lucide-react'
import { login, onAuthChange } from '../services/authService'
import { env } from '../utils/env'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (user) navigate('/admin', { replace: true })
    })
    return unsub
  }, [navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Preencha e-mail e senha.')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
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

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl"
        >
          <div className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <Button type="submit" loading={loading} size="lg" className="mt-5 w-full">
            <LogIn className="h-4 w-4" />
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
