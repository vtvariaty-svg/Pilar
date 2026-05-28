import { type ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { HardHat, LayoutDashboard, Image, LogOut, Users, Calculator, Calendar, Settings, Layers, SlidersHorizontal, ShieldCheck, CheckSquare, Building2, Cpu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { env } from '../../utils/env'

interface AdminLayoutProps {
  children: ReactNode
}

const baseNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/tarefas', label: 'Tarefas', icon: CheckSquare },
  { to: '/admin/pedidos', label: 'Pedidos', icon: Users },
  { to: '/admin/orcamentos', label: 'Estimativas', icon: Calculator },
  { to: '/admin/agendamentos', label: 'Agendamentos', icon: Calendar },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/parametros', label: 'Parametros', icon: SlidersHorizontal },
  { to: '/admin/servicos', label: 'Servicos', icon: Layers },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Image },
  { to: '/admin/configuracoes', label: 'Configuracoes', icon: Settings },
]

const superAdminNavItems = [
  { to: '/admin/usuarios', label: 'Usuarios', icon: ShieldCheck },
  { to: '/admin/tenants', label: 'Empresas', icon: Building2 },
  { to: '/admin/sistema', label: 'Sistema', icon: Cpu },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout, isSuperAdminUser } = useAuth()
  const navItems = isSuperAdminUser ? [...baseNavItems, ...superAdminNavItems] : baseNavItems
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  function isActive(to: string) {
    return location.pathname === to
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-60 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">{env.companyName}</p>
            <p className="mt-0.5 text-xs text-neutral-500">Painel Admin</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(to)
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-neutral-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <HardHat className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold">{env.companyName} · Admin</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto lg:hidden">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isActive(to) ? 'bg-neutral-950 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
