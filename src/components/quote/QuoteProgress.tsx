const STEPS = ['Serviço', 'Detalhes', 'Seus dados', 'Resultado']

interface QuoteProgressProps {
  current: number
}

export default function QuoteProgress({ current }: QuoteProgressProps) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`flex h-7 w-7 items-center justify-center text-xs font-bold transition ${
                  done
                    ? 'bg-brand-gold text-brand-dark'
                    : active
                    ? 'border border-brand-gold text-brand-gold bg-transparent'
                    : 'border border-[#2a2a28] text-brand-limestone/30 bg-transparent'
                }`}
              >
                {done ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-brand-offwhite' : done ? 'text-brand-gold/60' : 'text-brand-limestone/25'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-3 mb-5 sm:mb-0 transition ${i < current ? 'bg-brand-gold/40' : 'bg-[#2a2a28]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
