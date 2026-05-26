import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '../../data/faq'

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-3xl bg-neutral-50 p-5 text-left transition hover:bg-neutral-100"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-neutral-950">{q}</h3>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>
      {open && <p className="mt-3 text-sm leading-6 text-neutral-600">{a}</p>}
    </button>
  )
}

export default function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black tracking-tight">Dúvidas frequentes</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
