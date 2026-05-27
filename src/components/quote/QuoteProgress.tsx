import { CheckCircle2 } from 'lucide-react'

const STEPS = ['Serviço', 'Detalhes', 'Seus dados', 'Resultado']

interface QuoteProgressProps {
  current: number
}

export default function QuoteProgress({ current }: QuoteProgressProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  done ? 'bg-neutral-950 text-white' : active ? 'bg-neutral-950 text-white ring-4 ring-neutral-200' : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${active ? 'text-neutral-950' : 'text-neutral-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mb-4 h-0.5 w-10 sm:w-16 transition ${i < current ? 'bg-neutral-950' : 'bg-neutral-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
