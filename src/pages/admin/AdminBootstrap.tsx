import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HardHat, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getAdminUser, createAdminUser } from '../../services/adminUserService'

const SUPER_ADMIN_EMAIL = 'vtvariaty@gmail.com'

export default function AdminBootstrap() {
  const { user, loading, adminUserData } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'creating' | 'done' | 'already' | 'denied'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) { navigate('/admin/login', { replace: true }); return }
    if (user.email !== SUPER_ADMIN_EMAIL) { setStatus('denied'); return }
    if (adminUserData?.active) { setStatus('already'); return }
    // check directly in case AuthContext hasn't reloaded yet
    getAdminUser(user.uid).then((a) => {
      if (a?.active) setStatus('already')
    })
  }, [loading, user, adminUserData, navigate])

  async function handleBootstrap() {
    if (!user) return
    setStatus('creating')
    setError('')
    try {
      await createAdminUser({
        uid: user.uid,
        email: user.email!,
        name: user.displayName || user.email!.split('@')[0],
        role: 'super_admin',
        active: true,
      })
      setStatus('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar super admin.')
      setStatus('idle')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg">
            <HardHat className="h-8 w-8" />
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
          {status === 'denied' && (
            <>
              <p className="text-base font-bold text-red-600">Acesso negado</p>
              <p className="mt-2 text-sm text-neutral-500">
                Esta página é exclusiva para {SUPER_ADMIN_EMAIL}.
              </p>
              <a href="/entrar" className="mt-4 block text-sm text-neutral-950 underline">
                Voltar ao login
              </a>
            </>
          )}

          {(status === 'idle') && (
            <>
              <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-neutral-400" />
              <p className="text-base font-bold text-neutral-950">Configurar Super Admin</p>
              <p className="mt-2 text-sm text-neutral-500">
                Clique abaixo para registrar <strong>{user?.email}</strong> como super administrador da plataforma.
              </p>
              {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
              <button
                onClick={handleBootstrap}
                className="mt-5 w-full rounded-xl bg-neutral-950 py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Criar acesso super admin
              </button>
            </>
          )}

          {status === 'creating' && (
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
              <p className="text-sm text-neutral-500">Criando...</p>
            </div>
          )}

          {status === 'done' && (
            <>
              <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-green-600" />
              <p className="text-base font-bold text-green-700">Super admin configurado!</p>
              <p className="mt-2 text-sm text-neutral-500">
                Seu acesso ao painel administrativo está ativo.
              </p>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mt-5 w-full rounded-xl bg-neutral-950 py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Ir para o painel
              </button>
            </>
          )}

          {status === 'already' && (
            <>
              <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-neutral-600" />
              <p className="text-base font-bold text-neutral-950">Super admin já configurado</p>
              <p className="mt-2 text-sm text-neutral-500">
                Sua conta já possui acesso de super administrador.
              </p>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mt-5 w-full rounded-xl bg-neutral-950 py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Ir para o painel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
