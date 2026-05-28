import { useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PageHero from '../../components/public/PageHero'
import ProjectCard from '../../components/public/ProjectCard'
import PremiumCTA from '../../components/public/PremiumCTA'
import { projects, type ProjectType } from '../../data/projects'

const filters: { value: ProjectType | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'reforma', label: 'Reformas' },
  { value: 'construcao', label: 'Construções' },
  { value: 'acabamento', label: 'Acabamentos' },
  { value: 'ampliacao', label: 'Ampliações' },
]

export default function ProjectsPage() {
  const [active, setActive] = useState<ProjectType | 'todos'>('todos')

  const filtered = active === 'todos' ? projects : projects.filter((p) => p.type === active)

  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />
      <PageHero
        eyebrow="Portfólio"
        title="Obras que falam por si."
        subtitle="Cada projeto entregue pela Pilar representa planejamento rigoroso, equipe técnica dedicada e padrão de execução verificável. Conheça algumas das obras que fizemos."
      />

      {/* Filtros */}
      <section className="bg-[#111110] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={`border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  active === f.value
                    ? 'border-brand-gold bg-brand-gold text-brand-dark'
                    : 'border-[#2a2a28] text-brand-limestone/50 hover:border-brand-limestone/30 hover:text-brand-limestone'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid gap-px bg-[#2a2a28] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-brand-limestone/40 text-sm">
              Nenhuma obra encontrada para este filtro.
            </div>
          )}
        </div>
      </section>

      <PremiumCTA />
      <Footer />
    </div>
  )
}
