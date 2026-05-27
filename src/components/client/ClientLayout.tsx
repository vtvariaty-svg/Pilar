import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HardHat, LayoutDashboard, FileText, Calculator, Calendar, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { env } from '../../utils/env'

const navItems = [
  { to: '/cliente', label: 'Início', icon: LayoutDashboard },
  { to: '/cliente/solicitacoes', label: 'Solicitações', icon: FileText },
  { to: '/cliente/orcamentos', label: 'Estimativas', icon: Calculator },
  { to: '/cliente/agendamentos', label: 'Agendamentos', icon: Calendar },
  { to: '/cliente/perfil', label: 'Perfil', icon: User },
]

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { logout, userProfile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <HardHat className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-neutral-950">{env.companyName}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-neutral-500 sm:block">{userProfile?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6">
        <nav className="mb-6 flex gap-1 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
                location.pathname === to
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
