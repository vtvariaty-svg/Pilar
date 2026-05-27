import { Image as ImageIcon, Plus } from 'lucide-react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminRoute from '../components/admin/AdminRoute'
import { portfolioItems } from '../data/portfolio'
import Badge from '../components/ui/Badge'

export default function AdminPortfolio() {
  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-neutral-950">PortfÃ³lio</h1>
            <p className="mt-1 text-sm text-neutral-500">{portfolioItems.length} itens cadastrados</p>
          </div>
          <button
            disabled
            title="Em breve"
            className="flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Novo item
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          CRUD completo com Firebase Storage em desenvolvimento. Por enquanto, os itens sÃ£o gerenciados via cÃ³digo em <code>src/data/portfolio.ts</code>.
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-neutral-100 text-neutral-400">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-neutral-950 leading-snug">{item.title}</p>
                  <Badge className={item.status === 'concluida' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {item.status === 'concluida' ? 'ConcluÃ­da' : 'Em andamento'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{item.category} Â· {item.location}</p>
                <p className="mt-2 text-xs leading-5 text-neutral-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}

