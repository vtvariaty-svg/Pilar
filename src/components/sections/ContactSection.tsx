import { MapPin, Phone, Clock, ClipboardCheck } from 'lucide-react'
import { env } from '../../utils/env'
import QuoteForm from '../forms/QuoteForm'

export default function ContactSection() {
  return (
    <section id="orcamento" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div className="rounded-[2rem] bg-neutral-950 p-8 text-white shadow-2xl lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium">
          <ClipboardCheck className="h-4 w-4" />
          Pedido de orçamento
        </div>
        <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          Peça uma análise para sua obra ou reforma
        </h2>
        <p className="mt-4 text-base leading-7 text-neutral-300">
          Preencha os dados principais. Quanto mais detalhes, melhor será a avaliação inicial. Você receberá contato em até 24h úteis.
        </p>

        <div className="mt-8 space-y-4 text-sm text-neutral-200">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 shrink-0" />
            <span>Atendimento em {env.serviceRegion}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 shrink-0" />
            <span>WhatsApp disponível</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0" />
            <span>Análise inicial em até 24h úteis</span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold">Este formulário não gera orçamento automático.</p>
          <p className="mt-2 text-xs leading-5 text-neutral-400">
            A proposta depende de análise técnica, escopo, localização, materiais e disponibilidade da equipe. Após o envio, entraremos em contato.
          </p>
        </div>
      </div>

      <QuoteForm />
    </section>
  )
}
