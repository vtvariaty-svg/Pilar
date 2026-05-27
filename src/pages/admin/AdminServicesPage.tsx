import { useEffect, useState } from 'react'
import { Layers } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { subscribeServiceCatalog, toggleService } from '../../services/serviceCatalogService'
import type { ServiceCatalog } from '../../types/ServiceCatalog'

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceCatalog[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeServiceCatalog((data) => {
      setServices(data)
      setLoading(false)
    })
    return unsub
  }, [])

  async function handleToggle(id: string, active: boolean) {
    setToggling(id)
    await toggleService(id, active)
    setToggling(null)
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">ServiÃ§os</h1>
          <p className="mt-1 text-sm text-neutral-500">Ative ou desative serviÃ§os exibidos na calculadora e no site</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.active ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`font-semibold ${s.active ? 'text-neutral-950' : 'text-neutral-400'}`}>{s.name}</p>
                    <p className="text-xs text-neutral-500">{s.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(s.id, !s.active)}
                  disabled={toggling === s.id}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 ${
                    s.active ? 'bg-neutral-950' : 'bg-neutral-200'
                  }`}
                  role="switch"
                  aria-checked={s.active}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      s.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  )
}

