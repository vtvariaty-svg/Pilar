import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, UserX, MailCheck, Clock, UserPlus, X } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { useAuth } from '../../contexts/AuthContext'
import {
  subscribeAllUsers,
  subscribeAdminUsers,
  subscribeAdminInvites,
  createAdminInvite,
  cancelAdminInvite,
  deactivateAdmin,
  sendPasswordReset,
  type AdminInvite,
} from '../../services/userManagementService'
import type { AdminUser } from '../../types/AdminUser'
import type { UserProfile } from '../../types/UserProfile'

const SUPER_ADMIN_EMAIL = 'vtvariaty@gmail.com'

type Tab = 'todos' | 'admins' | 'convites'

interface MergedUser {
  uid: string
  name?: string
  email: string
  phone?: string
  isAdmin: boolean
  adminActive?: boolean
  adminRole?: string
}

export default function AdminUsersPage() {
  const { user, isSuperAdminUser } = useAuth()
  const [tab, setTab] = useState<Tab>('todos')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [invites, setInvites] = useState<AdminInvite[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const u1 = subscribeAllUsers(setUsers)
    const u2 = subscribeAdminUsers(setAdmins)
    const u3 = subscribeAdminInvites(setInvites)
    return () => { u1(); u2(); u3() }
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

  const adminMap = new Map(admins.map((a) => [a.uid, a]))

  const merged: MergedUser[] = users.map((u) => {
    const a = adminMap.get(u.uid)
    return {
      uid: u.uid,
      name: u.name,
      email: u.email,
      phone: u.phone,
      isAdmin: !!a,
      adminActive: a?.active,
      adminRole: a?.role,
    }
  })

  const filtered = merged.filter((u) => {
    if (search) {
      const s = search.toLowerCase()
      if (!u.name?.toLowerCase().includes(s) && !u.email.toLowerCase().includes(s)) return false
    }
    if (tab === 'admins') return u.isAdmin
    return true
  })

  const pendingInvites = invites.filter((i) => i.status === 'pending')

  async function handleInvite() {
    if (!inviteEmail.trim() || !user) return
    setInviting(true)
    setMsg(null)
    try {
      await createAdminInvite(inviteEmail.trim().toLowerCase(), 'admin', user.uid)
      setInviteEmail('')
      setMsg({ text: 'Convite criado. O usuario deve criar conta em /criar-conta.', ok: true })
    } catch {
      setMsg({ text: 'Erro ao criar convite.', ok: false })
    } finally {
      setInviting(false)
    }
  }

  async function handleCancelInvite(inviteId: string) {
    try {
      await cancelAdminInvite(inviteId)
    } catch {
      setMsg({ text: 'Erro ao cancelar convite.', ok: false })
    }
  }

  async function handleDeactivate(u: MergedUser) {
    if (u.email === SUPER_ADMIN_EMAIL) return
    if (!confirm(`Desativar ${u.email}?`)) return
    try {
      await deactivateAdmin(u.uid)
      setMsg({ text: `Admin ${u.email} desativado.`, ok: true })
    } catch {
      setMsg({ text: 'Erro ao desativar admin.', ok: false })
    }
  }

  async function handlePasswordReset(email: string) {
    try {
      await sendPasswordReset(email)
      setMsg({ text: `E-mail de redefincao enviado para ${email}.`, ok: true })
    } catch {
      setMsg({ text: 'Erro ao enviar e-mail de redefincao.', ok: false })
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'admins', label: 'Administradores' },
    { key: 'convites', label: `Convites${pendingInvites.length > 0 ? ` (${pendingInvites.length})` : ''}` },
  ]

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Usuarios</h1>
          <p className="mt-1 text-sm text-neutral-500">Gerencie usuarios, admins e convites</p>
        </div>

        {msg && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 flex gap-1 rounded-xl border border-neutral-200 bg-white p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Convites tab */}
        {tab === 'convites' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-950">
                <UserPlus className="h-4 w-4" /> Criar convite de admin
              </h2>
              <p className="mb-3 text-xs text-neutral-500">
                O usuario deve criar conta em <strong>/criar-conta</strong>. O sistema detecta o convite automaticamente e ativa o acesso.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
                />
                <button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-40"
                >
                  {inviting ? 'Criando...' : 'Convidar'}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-950">
                <Clock className="h-4 w-4" /> Convites pendentes
              </h2>
              {pendingInvites.length === 0 ? (
                <p className="text-sm text-neutral-400">Nenhum convite pendente.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {pendingInvites.map((inv) => (
                    <li
                      key={inv.id}
                      className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-neutral-800">{inv.email}</p>
                        <p className="text-xs text-neutral-500">{inv.role}</p>
                      </div>
                      <button
                        onClick={() => handleCancelInvite(inv.id)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                        title="Cancelar convite"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Users/Admins tabs */}
        {tab !== 'convites' && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="mb-4 w-full max-w-sm rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
            />

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-100">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold text-neutral-500">Nome</th>
                    <th className="hidden px-5 py-3 text-left font-semibold text-neutral-500 sm:table-cell">E-mail</th>
                    <th className="px-5 py-3 text-left font-semibold text-neutral-500">Tipo</th>
                    <th className="px-5 py-3 text-left font-semibold text-neutral-500">Status</th>
                    <th className="px-5 py-3 text-right font-semibold text-neutral-500">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-neutral-400">
                        Nenhum usuario encontrado.
                      </td>
                    </tr>
                  )}
                  {filtered.map((u) => (
                    <tr key={u.uid}>
                      <td className="px-5 py-3 font-medium text-neutral-900">
                        {u.name ?? '—'}
                      </td>
                      <td className="hidden px-5 py-3 text-neutral-500 sm:table-cell">{u.email}</td>
                      <td className="px-5 py-3">
                        {u.isAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                            <ShieldCheck className="h-3 w-3" />
                            {u.adminRole === 'super_admin' ? 'super_admin' : 'admin'}
                          </span>
                        ) : (
                          <span className="rounded-full bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500">
                            cliente
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {u.isAdmin ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              u.adminActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {u.adminActive ? 'ativo' : 'inativo'}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handlePasswordReset(u.email)}
                            title="Enviar reset de senha"
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          >
                            <MailCheck className="h-4 w-4" />
                          </button>
                          {u.isAdmin && u.adminActive && u.email !== SUPER_ADMIN_EMAIL && (
                            <button
                              onClick={() => handleDeactivate(u)}
                              title="Desativar admin"
                              className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </AdminLayout>
    </AdminRoute>
  )
}
