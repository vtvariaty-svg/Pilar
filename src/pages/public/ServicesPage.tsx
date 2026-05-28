import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PageHero from '../../components/public/PageHero'
import ServiceCard from '../../components/public/ServiceCard'
import PremiumCTA from '../../components/public/PremiumCTA'
import { publicServices } from '../../data/publicServices'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />
      <PageHero
        eyebrow="Serviços"
        title="Execução técnica em todas as frentes."
        subtitle="Atuamos em construção residencial, reformas completas, acabamentos e obras especializadas. Cada serviço conta com visita técnica, proposta formal e acompanhamento via plataforma."
      />

      {/* Grid de serviços */}
      <section className="bg-[#111110] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-px bg-[#2a2a28] sm:grid-cols-2 lg:grid-cols-3">
            {publicServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <PremiumCTA />
      <Footer />
    </div>
  )
}
