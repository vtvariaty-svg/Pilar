import type { QuoteInputs } from '../../types/QuoteEstimate'

interface QuoteStepInputsProps {
  serviceType: string
  inputs: QuoteInputs
  onChange: (patch: Partial<QuoteInputs>) => void
  onNext: () => void
  onBack: () => void
}

const finishOptions = [
  { value: 'economico', label: 'Econômico', hint: 'Materiais simples, mão de obra básica' },
  { value: 'intermediario', label: 'Intermediário', hint: 'Materiais de média qualidade, bom acabamento' },
  { value: 'alto_padrao', label: 'Alto padrão', hint: 'Materiais premium, acabamento refinado' },
]
const complexityOptions = [
  { value: 'baixa', label: 'Baixa', hint: 'Layout simples, obra direta' },
  { value: 'media', label: 'Média', hint: 'Alguns detalhes técnicos ou estruturais' },
  { value: 'alta', label: 'Alta', hint: 'Estrutura complexa, muitas interferências' },
]
const timelineOptions = [
  { value: 'normal', label: 'Normal', hint: 'Sem prazo urgente' },
  { value: 'urgente', label: 'Urgente', hint: 'Necessidade de início rápido' },
]

function ToggleGroup({ label, options, value, onChange }: {
  label: string
  options: { value: string; label: string; hint: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-neutral-700">{label}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-xl border-2 p-3 text-left transition ${
              value === opt.value ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-200 bg-white hover:border-neutral-400'
            }`}
          >
            <p className="text-sm font-bold">{opt.label}</p>
            <p className={`mt-0.5 text-xs ${value === opt.value ? 'text-neutral-300' : 'text-neutral-500'}`}>{opt.hint}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition hover:border-neutral-400">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded accent-neutral-950" />
      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </label>
  )
}

export default function QuoteStepInputs({ serviceType, inputs, onChange, onNext, onBack }: QuoteStepInputsProps) {
  const hasArea = !['Banheiro/cozinha', 'Outro'].includes(serviceType)

  function canProceed() {
    if (hasArea && (!inputs.areaM2 || inputs.areaM2 <= 0)) return false
    return true
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-neutral-950">Detalhes da obra</h2>
      <p className="mt-2 text-sm text-neutral-500">Quanto mais detalhes, mais precisa será a estimativa.</p>

      <div className="mt-6 flex flex-col gap-5">
        {hasArea && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Metragem aproximada (m²) *
            </label>
            <input
              type="number"
              min={1}
              value={inputs.areaM2 || ''}
              onChange={(e) => onChange({ areaM2: Number(e.target.value) })}
              placeholder="Ex.: 80"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
            />
          </div>
        )}

        <ToggleGroup
          label="Padrão de acabamento"
          options={finishOptions}
          value={inputs.finishStandard}
          onChange={(v) => onChange({ finishStandard: v as QuoteInputs['finishStandard'] })}
        />
        <ToggleGroup
          label="Complexidade percebida"
          options={complexityOptions}
          value={inputs.complexity}
          onChange={(v) => onChange({ complexity: v as QuoteInputs['complexity'] })}
        />
        <ToggleGroup
          label="Prazo"
          options={timelineOptions}
          value={inputs.timeline}
          onChange={(v) => onChange({ timeline: v as QuoteInputs['timeline'] })}
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-neutral-700">O que será incluído? (marque os que se aplicam)</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Checkbox label="Demolição" checked={inputs.includesDemolition} onChange={(v) => onChange({ includesDemolition: v })} />
            <Checkbox label="Instalação elétrica" checked={inputs.includesElectrical} onChange={(v) => onChange({ includesElectrical: v })} />
            <Checkbox label="Instalação hidráulica" checked={inputs.includesPlumbing} onChange={(v) => onChange({ includesPlumbing: v })} />
            <Checkbox label="Pintura" checked={inputs.includesPainting} onChange={(v) => onChange({ includesPainting: v })} />
            <Checkbox label="Piso / Revestimento" checked={inputs.includesFlooring} onChange={(v) => onChange({ includesFlooring: v })} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">Observações (opcional)</label>
          <textarea
            value={inputs.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            rows={3}
            placeholder="Descreva detalhes relevantes da obra..."
            className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onBack} className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed()}
          className="flex-1 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
