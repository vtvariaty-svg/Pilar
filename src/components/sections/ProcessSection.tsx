import { CheckCircle2 } from 'lucide-react'

const steps = [
  'Você envia fotos, medidas aproximadas e explica o que quer fazer.',
  'Nossa equipe faz uma análise inicial e entende o escopo da obra.',
  'Agendamos uma visita técnica quando o projeto tem perfil para execução.',
  'Você recebe uma proposta clara com etapas, prazos e condições.',
]

export default function ProcessSection() {
  return (
    <section id="processo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
          <CheckCircle2 className="h-4 w-4" />
          Como funciona
        </div>
        <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          Processo simples para sair da ideia e chegar na proposta
        </h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-black text-white">
              {index + 1}
            </div>
            <p className="mt-5 text-sm leading-6 text-neutral-700">{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
