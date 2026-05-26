import { ShieldCheck, CheckCircle2 } from 'lucide-react'

const trustItems = [
  'Fotos reais de obras executadas',
  'Atendimento direto pelo WhatsApp',
  'Proposta clara por etapa',
  'Cronograma de execução',
  'Contrato para obras maiores',
  'Equipe experiente e local',
]

export default function TrustSection() {
  return (
    <section className="bg-neutral-950 py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4" />
            Confiança vende obra
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            Seu cliente não quer só preço. Ele quer reduzir risco.
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-300">
            Por isso, nosso atendimento transmite organização: escopo, prazos, etapas, registro da obra, proposta formal e comunicação clara do início ao fim.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustItems.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium leading-6 text-neutral-100">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
