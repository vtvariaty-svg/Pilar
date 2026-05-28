import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../public/SectionHeader'

const steps = [
  { num: '01', title: 'Diagnóstico', desc: 'Análise do imóvel e da demanda. Entendemos o escopo, a estrutura existente e o padrão desejado.' },
  { num: '02', title: 'Estimativa', desc: 'Cálculo preliminar de custo com base nos dados levantados. Transparente, discriminada por etapa.' },
  { num: '03', title: 'Visita técnica', desc: 'Visita ao imóvel com o responsável técnico para confirmação do diagnóstico e ajuste da proposta.' },
  { num: '04', title: 'Proposta formal', desc: 'Documento completo com escopo, materiais previstos, prazos, cronograma e condições de pagamento.' },
  { num: '05', title: 'Cronograma', desc: 'Planejamento detalhado das etapas, com datas e marcos de execução compartilhados com o cliente.' },
  { num: '06', title: 'Execução', desc: 'Obra conduzida por equipe própria, com supervisão técnica e relatório de avanço regular.' },
  { num: '07', title: 'Entrega', desc: 'Vistoria final com o cliente, entrega de documentação e suporte pós-obra quando necessário.' },
]

export default function ProcessSection() {
  return (
    <section id="processo" className="bg-brand-offwhite py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Método Pilar"
            title="Um método claro para uma obra bem executada."
            subtitle="Cada etapa planejada, cada decisão documentada. Obra profissional não improvisa."
          />
          <Link
            to="/metodo"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-gold transition hover:text-brand-dark"
          >
            Ver método completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-16 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {steps.slice(0, 4).map((step, i) => (
            <div
              key={step.num}
              className={`border-t-2 border-brand-gold pt-8 pr-8 pb-10 ${i > 0 ? 'lg:pl-8 lg:border-l lg:border-l-neutral-200' : ''}`}
            >
              <p className="font-serif text-5xl font-bold leading-none text-brand-gold/20">{step.num}</p>
              <h3 className="mt-4 text-base font-bold text-brand-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-0 grid gap-0 border-t border-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {steps.slice(4).map((step, i) => (
            <div
              key={step.num}
              className={`pt-8 pr-8 pb-10 ${i > 0 ? 'lg:pl-8 lg:border-l lg:border-l-neutral-200' : ''}`}
            >
              <p className="font-serif text-5xl font-bold leading-none text-brand-gold/20">{step.num}</p>
              <h3 className="mt-4 text-base font-bold text-brand-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
