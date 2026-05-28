import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MapPin, Maximize2, Clock } from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PremiumCTA from '../../components/public/PremiumCTA'
import { projects, typeLabels, statusLabels } from '../../data/projects'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const project = projects.find((p) => p.slug === slug)
  if (!project) return <Navigate to="/obras" replace />

  const others = projects.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />

      {/* Hero */}
      <section className={`relative pt-32 pb-24 bg-gradient-to-br ${project.gradient}`}>
        <div className="absolute inset-0 bg-brand-dark/60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/obras"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-limestone/50 transition hover:text-brand-limestone"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Portfólio
          </Link>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="border border-brand-gold/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
              {typeLabels[project.type]}
            </span>
            <span className={`border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              project.status === 'entregue'
                ? 'border-green-500/30 text-green-400'
                : 'border-brand-limestone/30 text-brand-limestone/60'
            }`}>
              {statusLabels[project.status]}
            </span>
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight text-brand-offwhite sm:text-5xl lg:text-6xl max-w-3xl">
            {project.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-brand-limestone/50">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-gold/50" />
              {project.neighborhood}, {project.city}
            </span>
            {project.area && (
              <span className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-brand-gold/50" />
                {project.area}
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-gold/50" />
                {project.duration}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Descrição + Destaques */}
      <section className="bg-brand-offwhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Sobre a obra</p>
              <p className="text-base leading-7 text-neutral-700">{project.description}</p>
              <div className="mt-10">
                <Link
                  to="/contato"
                  className="inline-flex items-center gap-2 border border-brand-dark bg-brand-dark px-8 py-4 text-sm font-semibold text-brand-offwhite transition hover:bg-brand-concrete"
                >
                  Solicitar obra similar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Destaques técnicos</p>
              <ul className="space-y-4">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 border-b border-neutral-100 pb-4 last:border-0">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <span className="text-sm text-neutral-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder de fotos */}
      <section className="bg-[#111110] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Registro fotográfico</p>
          <div className="grid grid-cols-2 gap-px bg-[#2a2a28] lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`relative h-56 bg-gradient-to-br ${i % 2 === 0 ? project.gradient : project.gradientAlt} flex items-center justify-center`}
              >
                <p className="text-xs text-white/10 uppercase tracking-widest">Foto {i + 1}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-limestone/30 text-center">Fotos reais da obra — em breve</p>
        </div>
      </section>

      {/* Outras obras */}
      {others.length > 0 && (
        <section className="bg-brand-dark py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-10 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Outras obras</p>
            <div className="grid gap-px bg-[#2a2a28] sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to={`/obras/${p.slug}`}
                  className="group bg-brand-concrete p-8 transition hover:bg-[#2a2a28]"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-gold/60">{typeLabels[p.type]}</span>
                  <h3 className="mt-2 text-sm font-bold text-brand-offwhite group-hover:text-brand-gold transition">{p.title}</h3>
                  <p className="mt-1 text-xs text-brand-limestone/40">{p.neighborhood}, {p.city}</p>
                  <ArrowRight className="mt-4 h-4 w-4 text-brand-gold opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PremiumCTA />
      <Footer />
    </div>
  )
}
