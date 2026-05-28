import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PageHero from '../../components/public/PageHero'
import PremiumCTA from '../../components/public/PremiumCTA'
import { env } from '../../utils/env'

const values = [
  { title: 'Transparência antes do contrato', desc: 'Não iniciamos nenhuma obra sem uma proposta formal com escopo, prazo e valores definidos. O cliente sabe o que está contratando antes de assinar.' },
  { title: 'Visita técnica obrigatória', desc: 'Não cotamos obras que não visitamos. O diagnóstico presencial é parte do nosso método, não um favor.' },
  { title: 'Equipe técnica própria', desc: 'Trabalhamos com profissionais fixos, selecionados pelo histórico técnico e pelo alinhamento com nossos padrões de entrega.' },
  { title: 'Comunicação constante', desc: 'O cliente acompanha cada etapa da obra pela área do cliente, com fotos, status e cronograma atualizado.' },
  { title: 'Responsabilidade pela entrega', desc: 'Assumimos responsabilidade técnica pela execução. O que está na proposta é o que é entregue.' },
]

const stats = [
  { value: env.yearsExperience, label: 'anos de atuação' },
  { value: '100+', label: 'obras entregues' },
  { value: '98%', label: 'clientes satisfeitos' },
  { value: '24h', label: 'tempo de resposta' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />
      <PageHero
        eyebrow="Sobre a Pilar"
        title="Construção com responsabilidade técnica."
        subtitle={`Somos uma empreiteira especializada em construção residencial, reformas completas e acabamentos em ${env.serviceRegion}. Atuamos com método, transparência e comprometimento com o resultado.`}
      />

      {/* Missão */}
      <section className="bg-brand-offwhite py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Nossa missão</p>
              <h2 className="font-serif text-3xl font-bold leading-tight text-brand-dark sm:text-4xl">
                Obras entregues no prazo, dentro do orçamento e com qualidade verificável.
              </h2>
              <p className="mt-5 text-base leading-7 text-neutral-600">
                A Pilar nasceu da observação de um problema recorrente no setor: obras sem planejamento, orçamentos sem discriminação e comunicação inexistente. Criamos um modelo de execução que coloca o cliente no centro do processo.
              </p>
              <p className="mt-4 text-base leading-7 text-neutral-600">
                Cada obra começa com uma visita técnica, segue com uma proposta formal e é executada com cronograma, relatórios e acesso direto ao cliente via plataforma digital.
              </p>
              <div className="mt-10">
                <Link
                  to="/metodo"
                  className="inline-flex items-center gap-2 border border-brand-dark bg-brand-dark px-8 py-4 text-sm font-semibold text-brand-offwhite transition hover:bg-brand-concrete"
                >
                  Conhecer o método <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-px bg-neutral-200">
              {stats.map((s) => (
                <div key={s.label} className="bg-white p-10 text-center">
                  <p className="font-serif text-5xl font-bold text-brand-dark">{s.value}</p>
                  <p className="mt-2 text-sm text-neutral-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-[#111110] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Nossos valores</p>
          <h2 className="font-serif text-3xl font-bold text-brand-offwhite sm:text-4xl max-w-xl">
            O que nos orienta em cada obra.
          </h2>
          <div className="mt-14 space-y-px bg-[#2a2a28]">
            {values.map((v) => (
              <div key={v.title} className="bg-brand-concrete p-8 flex gap-6">
                <CheckCircle className="h-5 w-5 shrink-0 text-brand-gold mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-offwhite">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-limestone/60">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Região */}
      <section className="bg-brand-offwhite py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Região de atendimento</p>
          <h2 className="font-serif text-3xl font-bold text-brand-dark sm:text-4xl">
            Atuamos em {env.serviceRegion}.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-base leading-7 text-neutral-600">
            Atendemos residências e obras nos municípios da nossa região de atuação. Entre em contato para verificar cobertura para o seu endereço.
          </p>
          <div className="mt-10">
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-semibold text-brand-dark transition hover:bg-[#c9a76a]"
            >
              Verificar atendimento <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <PremiumCTA />
      <Footer />
    </div>
  )
}
