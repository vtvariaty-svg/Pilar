import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Calendar, ClipboardList, CheckCircle } from 'lucide-react'

const mockItems = [
  { icon: FileText, label: 'Estimativa criada', status: 'Aguardando visita', color: 'text-brand-gold' },
  { icon: Calendar, label: 'Visita técnica', status: 'Confirmada — 15/06', color: 'text-green-400' },
  { icon: ClipboardList, label: 'Proposta formal', status: 'Aguardando envio', color: 'text-brand-limestone' },
]

export default function ClientAreaSection() {
  return (
    <section className="bg-brand-offwhite py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Diferencial Pilar
            </p>
            <h2 className="font-serif text-3xl font-bold leading-tight text-brand-dark sm:text-4xl">
              Acompanhe sua obra em tempo real.
            </h2>
            <p className="mt-5 text-base leading-7 text-neutral-600">
              Com a área do cliente Pilar, você acessa estimativas, visitas técnicas agendadas, propostas formais e o status de cada etapa da sua obra. Transparência do início ao fim.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                'Estimativas e calculadora de custo',
                'Agendamento e confirmação de visita técnica',
                'Propostas formais com aprovação digital',
                'Timeline de etapas e acompanhamento de obra',
                'Comunicação direta com a equipe',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/entrar"
                className="inline-flex items-center gap-2 border border-brand-dark bg-brand-dark px-8 py-4 text-sm font-semibold text-brand-offwhite transition hover:bg-brand-concrete"
              >
                Entrar na área do cliente <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/criar-conta"
                className="inline-flex items-center gap-2 border border-neutral-400 px-8 py-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                Criar conta gratuita
              </Link>
            </div>
          </div>

          {/* Mock dashboard */}
          <div className="rounded-none border border-brand-concrete bg-brand-dark p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-limestone/50">Minha área</p>
              <div className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
            </div>
            <div className="space-y-3">
              {mockItems.map(({ icon: Icon, label, status, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border border-[#2a2a28] bg-brand-concrete p-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <p className="text-sm font-medium text-brand-offwhite">{label}</p>
                  </div>
                  <p className={`text-xs font-semibold ${color}`}>{status}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-[#2a2a28] pt-4">
              <p className="text-xs text-brand-limestone/30 text-center">
                Área exclusiva para clientes Pilar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
