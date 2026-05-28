import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PageHero from '../../components/public/PageHero'

const steps = [
  {
    num: '01',
    title: 'Contato inicial',
    desc: 'O cliente entra em contato pelo site, WhatsApp ou formulário. Descrevemos brevemente o processo, verificamos a localidade e agendamos a visita técnica.',
    detail: 'Nenhuma estimativa é fornecida antes da visita. Cotações enviadas sem diagnóstico presencial não refletem a realidade da obra.',
  },
  {
    num: '02',
    title: 'Visita técnica',
    desc: 'Um técnico Pilar visita o imóvel para avaliar o estado atual, entender o escopo desejado pelo cliente e identificar condicionantes que afetam prazo e custo.',
    detail: 'A visita técnica é gratuita e obrigatória. Não executamos obras sem diagnóstico presencial prévio.',
  },
  {
    num: '03',
    title: 'Estimativa preliminar',
    desc: 'Com base na visita, enviamos uma estimativa de custo por faixa, com discriminação dos principais itens de serviço e materiais.',
    detail: 'A estimativa não é contrato. Serve para alinhar expectativas antes da elaboração da proposta formal.',
  },
  {
    num: '04',
    title: 'Proposta formal',
    desc: 'Elaboramos proposta detalhada com escopo discriminado, cronograma de execução, forma de pagamento e responsabilidades de cada parte.',
    detail: 'A proposta formal é assinada digitalmente. O que está na proposta é o que é executado. Mudanças de escopo geram aditivos documentados.',
  },
  {
    num: '05',
    title: 'Início da obra',
    desc: 'Com a proposta aprovada e o pagamento da primeira etapa confirmado, iniciamos a obra conforme o cronograma acordado.',
    detail: 'O cliente recebe acesso à área do cliente no início da obra, com timeline, status e canal de comunicação direta com a equipe.',
  },
  {
    num: '06',
    title: 'Execução com relatórios',
    desc: 'A obra avança por etapas documentadas. A cada semana, o cliente recebe atualização de status e fotos do progresso pela área do cliente.',
    detail: 'Qualquer desvio de prazo é comunicado proativamente, antes de acontecer. Não esperamos o cliente perguntar.',
  },
  {
    num: '07',
    title: 'Entrega e pós-obra',
    desc: 'A entrega é feita com vistoria técnica. O cliente inspeciona o resultado e assina a ata de entrega. O suporte pós-obra está disponível para dúvidas e ajustes.',
    detail: 'A relação não termina com as chaves. Nossa equipe permanece acessível para qualquer questão relacionada à obra entregue.',
  },
]

const faqs = [
  { q: 'Quanto tempo leva para receber a proposta?', a: 'Após a visita técnica, a proposta é enviada em até 3 dias úteis.' },
  { q: 'Posso alterar o escopo após assinar a proposta?', a: 'Sim. Alterações de escopo geram aditivos formais com novo valor e prazo acordados entre as partes.' },
  { q: 'Vocês fornecem os materiais?', a: 'Sim, trabalhamos com fornecimento integral ou parcial de materiais, conforme a preferência do cliente.' },
  { q: 'Como funciona o pagamento?', a: 'O pagamento é feito por etapas conforme o cronograma definido na proposta. Não solicitamos pagamento integral antecipado.' },
  { q: 'Posso acompanhar a obra remotamente?', a: 'Sim. A área do cliente Pilar fornece status, fotos e timeline em tempo real, acessível de qualquer dispositivo.' },
]

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      <Header />
      <PageHero
        eyebrow="Nosso método"
        title="Processo claro do primeiro contato à entrega."
        subtitle="Cada obra Pilar segue um processo definido, com etapas documentadas, comunicação estruturada e responsabilidade técnica em cada fase."
      />

      {/* Etapas */}
      <section className="bg-[#111110] py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-px">
            {steps.map((step) => (
              <div key={step.num} className="bg-brand-concrete p-8 sm:p-10">
                <div className="flex gap-6">
                  <p className="font-serif text-5xl font-bold leading-none text-brand-gold/15 shrink-0 w-16">{step.num}</p>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-offwhite">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-brand-limestone/60">{step.desc}</p>
                    <p className="mt-3 text-xs leading-5 text-brand-limestone/35 border-l border-brand-gold/20 pl-4">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-offwhite py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold text-center">Dúvidas sobre o processo</p>
          <h2 className="font-serif text-3xl font-bold text-brand-dark text-center mb-14">Perguntas frequentes</h2>
          <div className="space-y-px bg-neutral-200">
            {faqs.map((item) => (
              <div key={item.q} className="bg-white p-6">
                <p className="text-sm font-bold text-brand-dark mb-2">{item.q}</p>
                <p className="text-sm leading-6 text-neutral-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA intermediário */}
      <section className="bg-brand-dark py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Pronto para começar?</p>
          <h2 className="font-serif text-3xl font-bold text-brand-offwhite sm:text-4xl">O primeiro passo é a visita técnica.</h2>
          <p className="mt-5 max-w-xl mx-auto text-base leading-7 text-brand-limestone/60">
            Entre em contato e agende sua visita. É gratuita, sem compromisso e necessária para qualquer proposta real.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-semibold text-brand-dark transition hover:bg-[#c9a76a]"
            >
              Agendar visita técnica <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 border border-[#3a3a38] px-8 py-4 text-sm font-semibold text-brand-limestone/70 transition hover:border-brand-limestone/60 hover:text-brand-limestone"
            >
              Ver serviços disponíveis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
