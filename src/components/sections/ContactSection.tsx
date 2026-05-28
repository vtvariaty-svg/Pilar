import { MapPin, Clock, MessageCircle, Camera } from 'lucide-react'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'
import QuoteForm from '../forms/QuoteForm'

export default function ContactSection() {
  return (
    <section id="contato" className="bg-brand-offwhite py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          {/* Info */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Contato
            </p>
            <h2 className="font-serif text-3xl font-bold leading-tight text-brand-dark sm:text-4xl">
              Vamos conversar sobre a sua obra.
            </h2>
            <p className="mt-5 text-base leading-7 text-neutral-600">
              Descreva o que você precisa ou envie fotos do imóvel. Nossa equipe analisa e retorna com orientações dentro de 24 horas.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/30 bg-brand-dark">
                  <MapPin className="h-4 w-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">Região de atendimento</p>
                  <p className="mt-1 text-sm text-neutral-600">{env.serviceRegion}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/30 bg-brand-dark">
                  <Clock className="h-4 w-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">Horário de atendimento</p>
                  <p className="mt-1 text-sm text-neutral-600">Segunda a sexta, das 8h às 18h</p>
                  <p className="text-sm text-neutral-500">Sábados mediante agendamento</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/30 bg-brand-dark">
                  <MessageCircle className="h-4 w-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">WhatsApp</p>
                  <a
                    href={whatsappLink('Olá, gostaria de solicitar uma análise da minha obra.')}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm text-brand-gold underline underline-offset-4 hover:text-brand-dark"
                  >
                    Iniciar conversa
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-gold/30 bg-brand-dark">
                  <Camera className="h-4 w-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">Enviar fotos pelo WhatsApp</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Fotos do imóvel aceleram o diagnóstico e permitem uma estimativa mais precisa antes da visita técnica.
                  </p>
                </div>
              </div>
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
  )
}
