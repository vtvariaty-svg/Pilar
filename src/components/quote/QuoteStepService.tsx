import { Home, Wrench, Ruler, Building2, Layers, CloudSun, Trees, HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const OPTIONS: Array<{ label: string; icon: LucideIcon; value: string }> = [
  { value: 'Construção do zero', label: 'Construção do zero', icon: Home },
  { value: 'Reforma completa', label: 'Reforma completa', icon: Wrench },
  { value: 'Ampliação', label: 'Ampliação', icon: Ruler },
  { value: 'Banheiro/cozinha', label: 'Banheiro / Cozinha', icon: Building2 },
  { value: 'Acabamento', label: 'Acabamento', icon: Layers },
  { value: 'Telhado', label: 'Telhado', icon: CloudSun },
  { value: 'Área externa', label: 'Área externa', icon: Trees },
  { value: 'Outro', label: 'Outro', icon: HelpCircle },
]

interface QuoteStepServiceProps {
  value: string
  onChange: (v: string) => void
  onNext: () => void
}

export default function QuoteStepService({ value, onChange, onNext }: QuoteStepServiceProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-neutral-950">Qual serviço você precisa?</h2>
      <p className="mt-2 text-sm text-neutral-500">Selecione o tipo mais próximo do que você quer fazer.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {OPTIONS.map(({ value: v, label, icon: Icon }) => (
          <button
            key={v}
            onClick={() => { onChange(v); onNext() }}
            className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition hover:border-neutral-950 hover:shadow-md ${
              value === v ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-200 bg-white text-neutral-700'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs font-semibold leading-4">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
