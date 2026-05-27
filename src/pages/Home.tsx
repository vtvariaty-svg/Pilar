import { MessageCircle, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import ServicesSection from '../components/sections/ServicesSection'
import TrustSection from '../components/sections/TrustSection'
import ProcessSection from '../components/sections/ProcessSection'
import PortfolioSection from '../components/sections/PortfolioSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import ContactSection from '../components/sections/ContactSection'
import FAQSection from '../components/sections/FAQSection'
import { whatsappLink } from '../utils/whatsapp'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <Header />
      <HeroSection />
      <ServicesSection />
      <TrustSection />
      <ProcessSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ContactSection />
      <FAQSection />
      <Footer />

      {/* Floating buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        <Link
          to="/orcamento"
          className="flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-sm font-bold text-white shadow-2xl transition hover:bg-neutral-800 sm:px-5"
          aria-label="Calcular estimativa"
        >
          <Calculator className="h-5 w-5" />
          <span className="hidden sm:inline">Calcular estimativa</span>
        </Link>
        <a
          href={whatsappLink('Olá, gostaria de solicitar um orçamento para obra ou reforma.')}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-2xl transition hover:bg-green-600 sm:px-5"
          aria-label="Falar pelo WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  )
}
