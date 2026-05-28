import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  gradient?: string
  backTo?: string
  backLabel?: string
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  gradient = 'from-[#0B0B0A] via-[#1a1a19] to-[#111110]',
  backTo,
  backLabel = 'Voltar',
}: PageHeroProps) {
  return (
    <section className={`relative bg-gradient-to-br ${gradient} pt-32 pb-20 lg:pt-40 lg:pb-28`}>
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(184,149,91,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(184,149,91,0.06) 0%, transparent 40%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {backTo && (
          <Link
            to={backTo}
            className="mb-8 inline-flex items-center gap-2 text-sm text-brand-limestone/70 transition hover:text-brand-limestone"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-brand-offwhite sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-limestone">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
