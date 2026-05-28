import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Logo } from '../ui/Logo'
import { env } from '../../utils/env'

const navLinks = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/obras', label: 'Obras' },
  { href: '/metodo', label: 'Método' },
  { href: '/orcamento', label: 'Orçamento' },
  { href: '/contato', label: 'Contato' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isTenantStaff, isAdminUser, isCustomer } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  function dashboardLink() {
    if (isAdminUser || isTenantStaff) return '/admin/dashboard'
    if (isCustomer) return '/cliente'
    return '/entrar'
  }

  const transparent = isHome && !scrolled && !mobileOpen
  const bg = transparent ? 'bg-transparent' : 'bg-brand-dark/95 backdrop-blur-md'
  const border = transparent ? 'border-transparent' : 'border-[#2a2a28]'
  const linkColor = 'text-brand-limestone/70 hover:text-brand-offwhite'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${bg} ${border}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-9 w-auto" alt={env.companyName} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition ${linkColor} ${location.pathname === link.href ? 'text-brand-offwhite' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <Link
                to={dashboardLink()}
                className="text-sm font-medium text-brand-limestone/70 transition hover:text-brand-offwhite"
              >
                Minha área
              </Link>
            ) : (
              <Link
                to="/entrar"
                className="text-sm font-medium text-brand-limestone/70 transition hover:text-brand-offwhite"
              >
                Área do cliente
              </Link>
            )}
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 border border-brand-gold bg-brand-gold px-5 py-2.5 text-xs font-bold text-brand-dark transition hover:bg-[#c9a76a]"
            >
              Solicitar análise <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded p-2 text-brand-limestone/70 hover:text-brand-offwhite lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-brand-dark pt-20 lg:hidden">
          <nav className="flex flex-1 flex-col gap-1 px-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="border-b border-[#2a2a28] py-5 font-serif text-2xl font-bold text-brand-offwhite transition hover:text-brand-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-10 space-y-3">
            <Link
              to="/contato"
              className="flex w-full items-center justify-center gap-2 border border-brand-gold bg-brand-gold py-4 text-sm font-bold text-brand-dark"
            >
              Solicitar análise <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={user ? dashboardLink() : '/entrar'}
              className="flex w-full items-center justify-center py-4 text-sm font-semibold text-brand-limestone/70 border border-[#2a2a28]"
            >
              {user ? 'Minha área' : 'Área do cliente'}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
