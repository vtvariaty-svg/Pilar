import { Link } from 'react-router-dom'
import { Instagram, MessageCircle } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'

const institucional = [
  { href: '/sobre', label: 'Sobre a Pilar' },
  { href: '/metodo', label: 'Nosso método' },
  { href: '/obras', label: 'Portfólio de obras' },
  { href: '/contato', label: 'Contato' },
]

const servicos = [
  { href: '/servicos/construcao-residencial', label: 'Construção residencial' },
  { href: '/servicos/reforma-completa', label: 'Reforma completa' },
  { href: '/servicos/acabamento-fino', label: 'Acabamento fino' },
  { href: '/servicos/banheiros-e-cozinhas', label: 'Banheiros e cozinhas' },
  { href: '/servicos/telhados-e-areas-externas', label: 'Telhados e áreas externas' },
  { href: '/servicos/ampliacoes', label: 'Ampliações' },
]

const cliente = [
  { href: '/entrar', label: 'Área do cliente' },
  { href: '/criar-conta', label: 'Criar conta' },
  { href: '/orcamento', label: 'Calcular estimativa' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0B0B0A] border-t border-[#1e1e1c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/">
              <Logo className="h-9 w-auto" alt={env.companyName} />
            </Link>
            <p className="mt-5 text-sm leading-6 text-brand-limestone/50 max-w-xs">
              Empreiteira especializada em construção civil, reformas completas e acabamentos em {env.serviceRegion}.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={whatsappLink('Olá, gostaria de solicitar uma análise da minha obra.')}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-[#2a2a28] text-brand-limestone/40 transition hover:border-brand-gold/40 hover:text-brand-gold"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              {env.instagramUrl && (
                <a
                  href={env.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center border border-[#2a2a28] text-brand-limestone/40 transition hover:border-brand-gold/40 hover:text-brand-gold"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Institucional */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/30 mb-5">Institucional</p>
            <ul className="space-y-3">
              {institucional.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-brand-limestone/50 transition hover:text-brand-offwhite">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/30 mb-5">Serviços</p>
            <ul className="space-y-3">
              {servicos.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-brand-limestone/50 transition hover:text-brand-offwhite">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cliente */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/30 mb-5">Cliente</p>
            <ul className="space-y-3">
              {cliente.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-brand-limestone/50 transition hover:text-brand-offwhite">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-[#1e1e1c] pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/20 mb-3">Admin</p>
              <Link
                to="/admin/login"
                className="text-xs text-brand-limestone/25 transition hover:text-brand-limestone/50"
              >
                Acesso administrativo
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#1e1e1c] pt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-limestone/25">
            © {year} {env.companyName}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-brand-limestone/20">
            Construção civil, reformas e acabamentos em {env.serviceRegion}.
          </p>
        </div>
      </div>
    </footer>
  )
}
