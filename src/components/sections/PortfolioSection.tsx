import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../public/SectionHeader'
import ProjectCard from '../public/ProjectCard'
import { projects } from '../../data/projects'

export default function PortfolioSection() {
  const featured = projects[0]
  const rest = projects.slice(1, 4)

  return (
    <section id="portfolio" className="bg-[#111110] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Portfólio"
            title="Obras executadas com método e padrão."
            subtitle="Cada projeto entregue representa nosso compromisso com qualidade, prazo e acabamento."
            light
          />
          <Link
            to="/obras"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-gold transition hover:text-brand-limestone"
          >
            Ver todas as obras <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-px bg-[#2a2a28] lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Featured */}
          <ProjectCard project={featured} large />
          {/* Secondary grid */}
          <div className="grid gap-px bg-[#2a2a28] lg:col-span-2 lg:grid-cols-2">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
