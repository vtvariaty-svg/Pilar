import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { services } from '../../data/services'

export default function ServicesSection() {
  return (
    <section id="servicos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
          <CheckCircle2 className="h-4 w-4" />
          Serviços principais
        </div>
        <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">O que executamos</h2>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          Trabalhamos com serviços de maior complexidade técnica, entregando qualidade e segurança em cada etapa da obra.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <motion.div
              key={service.title}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{service.text}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
