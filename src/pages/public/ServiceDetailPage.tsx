import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PremiumCTA from '../../components/public/PremiumCTA'
import { publicServices } from '../../data/publicServices'

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const service = publicServices.find((s) => s.slug === slug)
  if (!service) return <Navigate to="/servicos" replace />

  const others = publicServices.filter((s) => s.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />

      {/* Hero */}
      <section className={`relative pt-32 pb-24 bg-gradient-to-br ${service.gradient}`}>
        <div className="absolute inset-0 bg-brand-dark/60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/servicos"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-limestone/50 transition hover:text-brand-limestone"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Todos os serviços
          </Link>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Serviço</p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-brand-offwhite sm:text-5xl lg:text-6xl max-w-3xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-limestone/70">
            {service.description}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-semibold text-brand-dark transition hover:bg-[#c9a76a]"
            >
              Solicitar análise <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/obras"
              className="inline-flex items-center gap-2 border border-[#3a3a38] px-8 py-4 text-sm font-semibold text-brand-limestone/70 transition hover:border-brand-limestone/60 hover:text-brand-limestone"
            >
              Ver obras deste tipo
            </Link>
          </div>
        </div>
      </section>

      {/* Quando contratar */}
      <section className="bg-brand-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Quando contratar</p>
              <p className="text-base leading-7 text-neutral-700">{service.whenToHire}</p>
            </div>
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">O que está incluso</p>
              <ul className="space-y-3">
                {service.scope.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais + Etapas */}
      <section className="bg-[#111110] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Diferenciais</p>
              <ul className="space-y-4">
                {service.differentials.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-brand-limestone/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Etapas da obra</p>
              <ol className="space-y-3">
                {service.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="font-serif text-2xl font-bold leading-none text-brand-gold/20 w-8 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-1 text-sm font-medium text-brand-offwhite">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {service.faq.length > 0 && (
        <section className="bg-brand-offwhite py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="mb-10 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold text-center">Dúvidas frequentes</p>
            <div className="space-y-px bg-neutral-200">
              {service.faq.map((item, i) => (
                <div key={i} className="bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="text-sm font-bold text-brand-dark pr-4">{item.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-brand-gold" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="text-sm leading-6 text-neutral-600">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outros serviços */}
      <section className="bg-brand-dark py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-10 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Outros serviços</p>
          <div className="grid gap-px bg-[#2a2a28] sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                to={`/servicos/${s.slug}`}
                className="group bg-brand-concrete p-8 transition hover:bg-[#2a2a28]"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-offwhite group-hover:text-brand-gold transition">{s.title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-limestone/50">{s.shortDesc}</p>
                <ArrowRight className="mt-4 h-4 w-4 text-brand-gold opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PremiumCTA />
      <Footer />
    </div>
  )
}
