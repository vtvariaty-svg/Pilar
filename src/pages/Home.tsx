import { MessageCircle } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import ServicesSection from '../components/sections/ServicesSection'
import TrustSection from '../components/sections/TrustSection'
import ProcessSection from '../components/sections/ProcessSection'
import PortfolioSection from '../components/sections/PortfolioSection'
import BeforeAfterSection from '../components/sections/BeforeAfterSection'
import ClientAreaSection from '../components/sections/ClientAreaSection'
import ContactSection from '../components/sections/ContactSection'
import { whatsappLink } from '../utils/whatsapp'

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />
      <HeroSection />
      <ServicesSection />
      <TrustSection />
      <ProcessSection />
      <PortfolioSection />
      <BeforeAfterSection />
      <ClientAreaSection />
      <ContactSection />
      <Footer />

      {/* WhatsApp flutuante */}
      <a
        href={whatsappLink('Olá, gostaria de solicitar uma análise da minha obra.')}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center bg-green-500 text-white shadow-2xl transition hover:bg-green-600"
        aria-label="Falar pelo WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}
