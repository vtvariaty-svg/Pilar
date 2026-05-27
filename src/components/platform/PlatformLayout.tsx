import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, LayoutDashboard, Building2, Users, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/platform', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/platform/tenants', label: 'Tenants', icon: Building2 },
  { to: '/platform/users', label: 'Usuários', icon: Users },
  { to: '/platform/settings', label: 'Config', icon: Settings },
]

export default function PlatformLayout({ children }: { children: ReactNode }) {
  const { logout, userProfile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <aside className="hidden w-56 flex-col border-r border-white/10 lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-950">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Platform</p>
            <p className="mt-0.5 text-xs text-white/50">Admin global</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                location.pathname === to ? 'bg-white text-neutral-950' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="mb-2 px-3 text-xs text-white/40">{userProfile?.email}</p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-bold">Platform Admin</span>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  location.pathname === to ? 'bg-white text-neutral-950' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
