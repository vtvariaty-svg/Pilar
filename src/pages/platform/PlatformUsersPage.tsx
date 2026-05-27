import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import PlatformLayout from '../../components/platform/PlatformLayout'
import PlatformAdminRoute from '../../components/route/PlatformAdminRoute'
import { db } from '../../services/firebase'
import type { UserProfile } from '../../types/UserProfile'

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) =>
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserProfile)),
    )
    return unsub
  }, [])

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <PlatformAdminRoute>
      <PlatformLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-white">Usuários</h1>
          <p className="mt-1 text-sm text-white/50">{users.length} usuários registrados</p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="mb-4 w-full max-w-md rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
        />

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-white/50">Nome</th>
                <th className="hidden px-5 py-3 text-left font-semibold text-white/50 sm:table-cell">E-mail</th>
                <th className="px-5 py-3 text-left font-semibold text-white/50">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => (
                <tr key={u.uid}>
                  <td className="px-5 py-3 font-medium text-white">{u.name}</td>
                  <td className="hidden px-5 py-3 text-white/60 sm:table-cell">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.globalRole === 'platform_admin' ? 'bg-yellow-900 text-yellow-300' : 'bg-white/10 text-white/60'
                    }`}>
                      {u.globalRole}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PlatformLayout>
    </PlatformAdminRoute>
  )
}
