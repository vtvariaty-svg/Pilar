import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HardHat, MessageCircle, Menu, X, Calculator, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'

const navLinks = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Como funciona' },
  { href: '#portfolio', label: 'Portfólio' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isTenantStaff, isPlatformAdmin, isCustomer } = useAuth()

  function dashboardLink() {
    if (isPlatformAdmin) return '/platform'
    if (isTenantStaff) return '/admin/dashboard'
    if (isCustomer) return '/cliente'
    return '/entrar'
  }

  function dashboardLabel() {
    if (isPlatformAdmin) return 'Plataforma'
    if (isTenantStaff) return 'Painel admin'
    if (isCustomer) return 'Minha área'
    return 'Área do cliente'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-bold leading-none">{env.companyName}</p>
            <p className="mt-1 text-xs text-neutral-500">Construção • Reforma • Acabamento</p>
          </div>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-700 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-neutral-950">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/orcamento"
            className="flex items-center gap-2 rounded-2xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            <Calculator className="h-4 w-4" />
            Calcular orçamento
          </Link>
          <Link
            to={dashboardLink()}
            className="flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800"
          >
            <User className="h-4 w-4" />
            {dashboardLabel()}
          </Link>
          {!user && (
            <a
              href={whatsappLink('Olá, gostaria de pedir um orçamento para obra ou reforma.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/orcamento"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Calculator className="h-4 w-4" />
              Calcular orçamento
            </Link>
            <Link
              to={dashboardLink()}
              onClick={() => setMobileOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
            >
              <User className="h-4 w-4" />
              {dashboardLabel()}
            </Link>
            {!user && (
              <a
                href={whatsappLink('Olá, gostaria de pedir um orçamento para obra ou reforma.')}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" /> Falar pelo WhatsApp
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
