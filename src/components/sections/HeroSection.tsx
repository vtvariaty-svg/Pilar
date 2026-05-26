import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, MessageCircle, Image as ImageIcon } from 'lucide-react'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs leading-5 text-neutral-500">{label}</p>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-neutral-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm w-fit">
            <CheckCircle2 className="h-4 w-4" />
            Atendimento em {env.serviceRegion}
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            Reforma e construção com orçamento claro, equipe confiável e execução do início ao fim.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Envie fotos do imóvel e explique o que deseja fazer. Nossa equipe avalia o serviço, orienta os próximos passos e agenda uma visita técnica quando necessário.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink('Olá, quero solicitar uma análise inicial para obra ou reforma. Posso enviar fotos do imóvel?')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800"
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar orçamento pelo WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-sm transition hover:bg-neutral-100"
            >
              Ver serviços
            </a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            <StatCard value={env.yearsExperience} label="anos de experiência em obra" />
            <StatCard value="24h" label="para análise inicial" />
            <StatCard value="100%" label="foco em obra bem executada" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative hidden lg:block"
        >
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-2xl">
            <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-neutral-100 text-neutral-400">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12" />
                <p className="mt-3 text-sm font-semibold">Foto real de obra</p>
                <p className="mt-1 text-xs">Antes/depois, fachada, acabamento ou equipe</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {['Reforma completa', 'Construção nova', 'Acabamento fino'].map((item) => (
                <div key={item} className="rounded-2xl bg-neutral-100 p-3 text-xs font-medium text-neutral-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
