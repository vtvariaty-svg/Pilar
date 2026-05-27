import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { subscribeCustomers } from '../../services/customerService'
import { formatDate } from '../../utils/formatDate'
import { formatBrazilPhone } from '../../utils/phone'
import type { Customer } from '../../types/Customer'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const unsub = subscribeCustomers((data) => {
      setCustomers(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = customers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search),
  )

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Clientes</h1>
          <p className="mt-1 text-sm text-neutral-500">{customers.length} clientes cadastrados</p>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="w-full max-w-md rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-950"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <Users className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-neutral-600">Nome</th>
                  <th className="hidden px-5 py-3 text-left font-semibold text-neutral-600 sm:table-cell">E-mail</th>
                  <th className="hidden px-5 py-3 text-left font-semibold text-neutral-600 md:table-cell">Telefone</th>
                  <th className="px-5 py-3 text-left font-semibold text-neutral-600">Cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((c) => (
                  <tr key={c.uid} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 font-medium text-neutral-950">{c.name}</td>
                    <td className="hidden px-5 py-3 text-neutral-600 sm:table-cell">{c.email}</td>
                    <td className="hidden px-5 py-3 text-neutral-600 md:table-cell">{formatBrazilPhone(c.phone)}</td>
                    <td className="px-5 py-3 text-neutral-500">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  )
}

