import { useState } from 'react'
import { HardHat, MessageCircle, Menu, X } from 'lucide-react'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'

const navLinks = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Como funciona' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#orcamento', label: 'Orçamento' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

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

        <div className="flex items-center gap-3">
          <a
            href={whatsappLink('Olá, gostaria de pedir um orçamento para obra ou reforma.')}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              >
                {link.label}
              </a>
            ))}
            <a
              href={whatsappLink('Olá, gostaria de pedir um orçamento para obra ou reforma.')}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" /> Falar pelo WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
