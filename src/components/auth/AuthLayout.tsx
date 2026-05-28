import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { env } from '../../utils/env'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  mode?: 'client' | 'admin'
  footer?: ReactNode
}

export default function AuthLayout({ title, subtitle, children, mode = 'client', footer }: AuthLayoutProps) {
  const isAdmin = mode === 'admin'

  return (
    <div className="flex min-h-screen bg-brand-dark">
      {/* Left panel — branding */}
      <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-[#0B0B0A] border-r border-[#1e1e1c] overflow-hidden">
        {/* Gold texture radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 60%, rgba(184,149,91,0.08) 0%, transparent 55%), radial-gradient(circle at 80% 10%, rgba(184,149,91,0.04) 0%, transparent 40%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(184,149,91,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(184,149,91,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative">
          <Link to="/">
            <Logo className="h-8 w-auto" alt={env.companyName} />
          </Link>
        </div>

        <div className="relative">
          {isAdmin ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6">
                Acesso administrativo
              </p>
              <p className="font-serif text-3xl font-bold leading-tight text-brand-offwhite">
                Gestão da operação Pilar.
              </p>
              <p className="mt-4 text-sm leading-6 text-brand-limestone/50">
                Área restrita para membros da equipe. Acesso não autorizado é registrado.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6">
                Área do cliente
              </p>
              <p className="font-serif text-3xl font-bold leading-tight text-brand-offwhite">
                Acompanhe sua obra em tempo real.
              </p>
              <p className="mt-4 text-sm leading-6 text-brand-limestone/50">
                Estimativas, visitas técnicas, propostas formais e status de etapas — tudo em um só lugar.
              </p>
            </>
          )}

          <div className="mt-10 pt-8 border-t border-[#1e1e1c] flex items-center gap-3">
            <span className="h-1 w-6 bg-brand-gold/40" />
            <p className="text-xs text-brand-limestone/30 uppercase tracking-widest">{env.companyName}</p>
          </div>
        </div>

        {/* Architectural decorative block */}
        <div className="relative opacity-10">
          <div className="absolute bottom-0 right-0 h-48 w-48 border border-brand-gold/20"
            style={{ transform: 'translate(20%, 20%)' }} />
          <div className="absolute bottom-0 right-0 h-32 w-32 border border-brand-gold/10"
            style={{ transform: 'translate(10%, 10%)' }} />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-6 lg:hidden border-b border-[#1e1e1c]">
          <Link to="/">
            <Logo className="h-7 w-auto" alt={env.companyName} />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-medium text-brand-limestone/50 hover:text-brand-limestone"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Voltar ao site (desktop) */}
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-brand-limestone/40 hover:text-brand-limestone/70 mb-10 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao site
            </Link>

            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-brand-offwhite">{title}</h1>
              {subtitle && (
                <p className="mt-3 text-sm leading-6 text-brand-limestone/60">{subtitle}</p>
              )}
            </div>

            {children}

            {footer && (
              <div className="mt-8 pt-6 border-t border-[#1e1e1c]">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
