import { MapPin, Clock, MessageCircle, Camera } from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PageHero from '../../components/public/PageHero'
import QuoteForm from '../../components/forms/QuoteForm'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'

const info = [
  {
    icon: MapPin,
    title: 'Região de atendimento',
    content: env.serviceRegion,
    link: null,
  },
  {
    icon: Clock,
    title: 'Horário de atendimento',
    content: 'Segunda a sexta, das 8h às 18h',
    sub: 'Sábados mediante agendamento',
    link: null,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: 'Iniciar conversa',
    link: whatsappLink('Olá, gostaria de solicitar uma análise da minha obra.'),
  },
  {
    icon: Camera,
    title: 'Enviar fotos pelo WhatsApp',
    content: 'Fotos do imóvel aceleram o diagnóstico e permitem uma estimativa mais precisa antes da visita técnica.',
    link: null,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />
      <PageHero
        eyebrow="Contato"
        title="Vamos conversar sobre a sua obra."
        subtitle="Descreva o que você precisa ou envie fotos do imóvel. Nossa equipe analisa e retorna com orientações dentro de 24 horas."
      />

      <section className="bg-brand-offwhite py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
            {/* Info */}
            <div>
              <div className="space-y-6">
                {info.map(({ icon: Icon, title, content, link, sub }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/30 bg-brand-dark">
                      <Icon className="h-4 w-4 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{title}</p>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-sm text-brand-gold underline underline-offset-4 hover:text-brand-dark"
                        >
                          {content}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-neutral-600">{content}</p>
                      )}
                      {sub && <p className="text-sm text-neutral-500">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="border border-neutral-200 bg-white p-8 shadow-sm">
              <p className="mb-6 text-sm font-bold text-brand-dark">Solicitar análise ou orçamento</p>
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
