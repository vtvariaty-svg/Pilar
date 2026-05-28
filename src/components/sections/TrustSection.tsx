import SectionHeader from '../public/SectionHeader'

const pillars = [
  { num: '01', title: 'Contrato claro', desc: 'Escopo, prazo e valores definidos antes do início. Sem surpresas no meio da obra.' },
  { num: '02', title: 'Cronograma real', desc: 'Planejamento honesto, com datas revisadas sempre que necessário e comunicadas com antecedência.' },
  { num: '03', title: 'Equipe experiente', desc: 'Profissionais com anos de atuação em obras residenciais, selecionados pelo histórico técnico.' },
  { num: '04', title: 'Comunicação constante', desc: 'Relatórios fotográficos, atualização de etapas e acesso à área do cliente durante toda a obra.' },
  { num: '05', title: 'Visita técnica', desc: 'Diagnóstico presencial antes da proposta. Não cotamos obras que não visitamos.' },
  { num: '06', title: 'Proposta formal', desc: 'Documento detalhado com discriminação de serviços, materiais, responsabilidades e condições.' },
  { num: '07', title: 'Acabamento cuidadoso', desc: 'O acabamento define o padrão da entrega. Nossa equipe trata cada detalhe com atenção técnica.' },
  { num: '08', title: 'Pós-obra', desc: 'Suporte para dúvidas e ajustes após a entrega. A relação não termina com as chaves.' },
]

export default function TrustSection() {
  return (
    <section className="bg-[#111110] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Por que a Pilar"
          title="O que diferencia uma obra profissional."
          subtitle="Não trabalhamos com promessas. Trabalhamos com processo, método e responsabilidade técnica."
          light
          centered
        />

        <div className="mt-16 grid gap-px bg-[#2a2a28] sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.num} className="bg-brand-concrete p-8">
              <p className="font-serif text-4xl font-bold leading-none text-brand-gold/20">{p.num}</p>
              <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-brand-offwhite">{p.title}</h3>
              <p className="mt-3 text-sm leading-6 text-brand-limestone/60">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
