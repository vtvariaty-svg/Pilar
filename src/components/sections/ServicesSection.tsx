import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../public/SectionHeader'
import ServiceCard from '../public/ServiceCard'
import { publicServices } from '../../data/publicServices'

export default function ServicesSection() {
  return (
    <section id="servicos" className="bg-brand-dark py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="O que executamos"
            title="Especialistas em obras residenciais"
            subtitle="Cada serviço executado com equipe própria, método rigoroso e comunicação transparente em todas as etapas."
            light
          />
          <Link
            to="/servicos"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-gold transition hover:text-brand-limestone"
          >
            Ver todos os serviços <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-px bg-[#2a2a28] sm:grid-cols-2 lg:grid-cols-3">
          {publicServices.slice(0, 6).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
