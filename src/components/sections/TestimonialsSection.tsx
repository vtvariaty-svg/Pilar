import { Star, CheckCircle2 } from 'lucide-react'
import { testimonials } from '../../data/testimonials'

export default function TestimonialsSection() {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
            <CheckCircle2 className="h-4 w-4" />
            Depoimentos
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-700">"{t.text}"</p>
              <div className="mt-4 border-t border-neutral-100 pt-4">
                <p className="text-sm font-bold">{t.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
