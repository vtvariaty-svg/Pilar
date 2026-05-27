import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, UserX, Plus, Clock } from 'lucide-react'
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { useAuth } from '../../contexts/AuthContext'
import { listAdminUsers, deactivateAdminUser } from '../../services/adminUserService'
import { db } from '../../services/firebase'
import type { AdminUser } from '../../types/AdminUser'

const SUPER_ADMIN_EMAIL = 'vtvariaty@gmail.com'

interface AdminInvite {
  id: string
  email: string
  role: string
  status: string
  createdBy: string
  createdAt: { seconds: number } | null
}

export default function AdminUsersPage() {
  const { user, isSuperAdminUser } = useAuth()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [invites, setInvites] = useState<AdminInvite[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [loadingAdmins, setLoadingAdmins] = useState(true)

  useEffect(() => {
    listAdminUsers().then((list) => { setAdmins(list); setLoadingAdmins(false) })

    const unsub = onSnapshot(collection(db, 'adminInvites'), (snap) => {
      setInvites(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminInvite))
    })
    return unsub
  }, [])

  if (!isSuperAdminUser) {
    return (
      <AdminRoute>
        <AdminLayout>
          <Navigate to="/admin/dashboard" replace />
        </AdminLayout>
      </AdminRoute>
    )
  }

  async function handleInvite(e: FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim() || !user) return
    setInviting(true)
    setInviteMsg('')
    try {
      await addDoc(collection(db, 'adminInvites'), {
        email: inviteEmail.trim().toLowerCase(),
        role: 'admin',
        status: 'pending',
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      })
      setInviteEmail('')
      setInviteMsg('Convite criado. Compartilhe com o usuário o link /admin/bootstrap após ele criar a conta.')
    } catch {
      setInviteMsg('Erro ao criar convite.')
    } finally {
      setInviting(false)
    }
  }

  async function handleDeactivate(admin: AdminUser) {
    if (admin.email === SUPER_ADMIN_EMAIL) return
    if (!confirm(`Desativar ${admin.email}?`)) return
    await deactivateAdminUser(admin.uid)
    setAdmins((prev) => prev.map((a) => a.uid === admin.uid ? { ...a, active: false } : a))
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Usuários Admin</h1>
          <p className="mt-1 text-sm text-neutral-500">Gerencie os administradores da plataforma</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active admins */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-950">
              <ShieldCheck className="h-4 w-4" /> Administradores ativos
            </h2>
            {loadingAdmins ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
            ) : admins.length === 0 ? (
              <p className="text-sm text-neutral-400">Nenhum administrador cadastrado.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {admins.map((a) => (
                  <li key={a.uid} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{a.email}</p>
                      <p className="text-xs text-neutral-500">{a.role} · {a.active ? 'ativo' : 'inativo'}</p>
                    </div>
                    {a.email !== SUPER_ADMIN_EMAIL && a.active && (
                      <button
                        onClick={() => handleDeactivate(a)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                        title="Desativar"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    )}
                    {a.email === SUPER_ADMIN_EMAIL && (
                      <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-bold text-neutral-600">
                        super_admin
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Invite form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-950">
              <Plus className="h-4 w-4" /> Convidar administrador
            </h2>
            <p className="mb-4 text-xs text-neutral-500">
              O usuário deve criar uma conta em <strong>/criar-conta</strong>, depois acessar <strong>/admin/bootstrap</strong> para ativar o acesso.
            </p>
            <form onSubmit={handleInvite} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
              />
              {inviteMsg && (
                <p className={`rounded-xl px-3 py-2 text-xs ${inviteMsg.startsWith('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {inviteMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={inviting}
                className="rounded-xl bg-neutral-950 py-2.5 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-40"
              >
                {inviting ? 'Criando convite...' : 'Criar convite'}
              </button>
            </form>

            {/* Pending invites */}
            {invites.filter((i) => i.status === 'pending').length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <Clock className="h-3 w-3" /> Convites pendentes
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {invites.filter((i) => i.status === 'pending').map((inv) => (
                    <li key={inv.id} className="rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                      {inv.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}
