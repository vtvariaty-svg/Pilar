import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'

const seals = [
  'Reforma completa',
  'Construção residencial',
  'Acabamento fino',
  'Visita técnica',
  'Proposta formal',
]

export default function HeroSection() {
  return (
    <section id="top" className="relative min-h-screen bg-brand-dark overflow-hidden flex items-center">
      {/* Background architectural gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0A] via-[#111110] to-[#0f1a14]" />
        {/* TODO: Replace with real high-quality hero photo */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 70% 50%, rgba(184,149,91,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(30,51,40,0.4) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)',
          }}
        />
      </div>

      {/* Diagonal accent line */}
      <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent hidden lg:block" style={{ right: '30%' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 lg:py-0 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Region badge */}
            <div className="mb-8 inline-flex items-center gap-3">
              <div className="h-px w-8 bg-brand-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                {env.serviceRegion}
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[1.08] tracking-tight text-brand-offwhite sm:text-6xl lg:text-7xl">
              Obras residenciais<br />
              <em className="not-italic text-brand-limestone">executadas com</em><br />
              precisão e padrão.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-brand-limestone/80">
              Da primeira análise à entrega final, conduzimos reformas e construções com método, transparência e responsabilidade técnica.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contato"
                className="inline-flex items-center justify-center gap-2 border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-semibold text-brand-dark transition hover:bg-[#c9a76a] hover:border-[#c9a76a]"
              >
                Solicitar análise da obra
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/orcamento"
                className="inline-flex items-center justify-center gap-2 border border-brand-limestone/30 px-8 py-4 text-sm font-semibold text-brand-limestone transition hover:border-brand-limestone hover:text-brand-offwhite"
              >
                Calcular estimativa
              </Link>
              <a
                href={whatsappLink('Olá, gostaria de solicitar uma análise da minha obra ou reforma.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#2a2a28] px-8 py-4 text-sm font-semibold text-brand-limestone/60 transition hover:border-brand-limestone/40 hover:text-brand-limestone sm:px-6"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            {/* Seals */}
            <div className="mt-14 flex flex-wrap gap-2">
              {seals.map((s) => (
                <span
                  key={s}
                  className="border border-[#2a2a28] px-3 py-1.5 text-xs font-medium text-brand-limestone/50 tracking-wide"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: stats column */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:flex flex-col gap-8 border-l border-[#2a2a28] pl-12"
          >
            {[
              { value: env.yearsExperience, label: 'anos de experiência' },
              { value: '100+', label: 'obras entregues' },
              { value: '24h', label: 'para análise inicial' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl font-bold text-brand-offwhite">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-brand-limestone/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#servicos"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-limestone/30 transition hover:text-brand-limestone/60"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  )
}
