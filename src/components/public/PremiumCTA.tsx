import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { whatsappLink } from '../../utils/whatsapp'

interface PremiumCTAProps {
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryTo?: string
  showWhatsApp?: boolean
  dark?: boolean
}

export default function PremiumCTA({
  title = 'Pronto para iniciar sua obra?',
  subtitle = 'Solicite uma análise sem compromisso. Nossa equipe responde em até 24 horas.',
  primaryLabel = 'Calcular estimativa',
  primaryTo = '/orcamento',
  showWhatsApp = true,
  dark = true,
}: PremiumCTAProps) {
  const bg = dark ? 'bg-brand-dark' : 'bg-brand-offwhite'
  const headingColor = dark ? 'text-brand-offwhite' : 'text-brand-dark'
  const subColor = dark ? 'text-brand-limestone' : 'text-neutral-600'

  return (
    <section className={`${bg} py-20`}>
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
          Próximo passo
        </p>
        <h2 className={`font-serif text-3xl font-bold ${headingColor} sm:text-4xl`}>
          {title}
        </h2>
        <p className={`mt-5 text-base leading-7 ${subColor}`}>{subtitle}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to={primaryTo}
            className="inline-flex items-center gap-2 rounded-none border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-semibold text-brand-dark transition hover:bg-[#c9a76a] hover:border-[#c9a76a]"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {showWhatsApp && (
            <a
              href={whatsappLink('Olá, gostaria de solicitar uma análise da minha obra.')}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-none border px-8 py-4 text-sm font-semibold transition ${
                dark
                  ? 'border-brand-limestone/40 text-brand-limestone hover:border-brand-limestone hover:text-brand-offwhite'
                  : 'border-neutral-400 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              Falar pelo WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
