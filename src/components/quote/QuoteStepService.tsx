interface Option {
  label: string
  value: string
  desc: string
  scope: string
}

const OPTIONS: Option[] = [
  { value: 'Construção do zero', label: 'Construção Residencial', desc: 'Casa ou sobrado do início ao fim', scope: 'Estrutura • Alvenaria • Acabamento' },
  { value: 'Reforma completa', label: 'Reforma Completa', desc: 'Renovação total do imóvel', scope: 'Demolição • Instalações • Acabamento' },
  { value: 'Ampliação', label: 'Ampliação', desc: 'Expansão de área existente', scope: 'Estrutura • Integração • Acabamento' },
  { value: 'Banheiro/cozinha', label: 'Banheiro e Cozinha', desc: 'Ambientes de maior complexidade técnica', scope: 'Hidráulica • Revestimento • Marcenaria' },
  { value: 'Acabamento', label: 'Acabamento Fino', desc: 'Revestimentos, gesso e pintura premium', scope: 'Piso • Gesso • Pintura • Detalhes' },
  { value: 'Telhado', label: 'Telhado e Cobertura', desc: 'Troca de cobertura e impermeabilização', scope: 'Estrutura • Telhas • Calhas • Rufos' },
  { value: 'Área externa', label: 'Área Externa', desc: 'Lazer, churrasqueira e pergolado', scope: 'Cobertura • Piso externo • Alvenaria' },
  { value: 'Outro', label: 'Outro Serviço', desc: 'Não encontrei o serviço acima', scope: 'Análise personalizada' },
]

interface QuoteStepServiceProps {
  value: string
  onChange: (v: string) => void
  onNext: () => void
}

export default function QuoteStepService({ value, onChange, onNext }: QuoteStepServiceProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold mb-3">Etapa 1 de 3</p>
      <h2 className="font-serif text-2xl font-bold text-brand-offwhite">Qual serviço você precisa?</h2>
      <p className="mt-2 text-sm text-brand-limestone/60">Selecione o tipo mais próximo do que você quer executar.</p>

      <div className="mt-8 grid grid-cols-1 gap-px bg-[#2a2a28] sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`text-left p-5 transition ${
                selected
                  ? 'bg-brand-gold/10 border-l-2 border-brand-gold'
                  : 'bg-brand-concrete hover:bg-[#2a2a28]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`text-sm font-bold ${selected ? 'text-brand-gold' : 'text-brand-offwhite'}`}>
                    {opt.label}
                  </p>
                  <p className="mt-1 text-xs text-brand-limestone/50">{opt.desc}</p>
                  <p className="mt-2 text-xs text-brand-limestone/30 font-mono">{opt.scope}</p>
                </div>
                <div className={`mt-0.5 h-4 w-4 shrink-0 border ${selected ? 'border-brand-gold bg-brand-gold' : 'border-[#2a2a28]'} flex items-center justify-center`}>
                  {selected && (
                    <svg className="h-2.5 w-2.5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!value}
        className="mt-8 w-full border border-brand-gold bg-brand-gold px-6 py-4 text-sm font-bold text-brand-dark transition hover:bg-[#c9a76a] disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  )
}
