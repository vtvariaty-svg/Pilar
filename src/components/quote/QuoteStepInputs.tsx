import type { QuoteInputs } from '../../types/QuoteEstimate'

interface QuoteStepInputsProps {
  serviceType: string
  inputs: QuoteInputs
  onChange: (patch: Partial<QuoteInputs>) => void
  onNext: () => void
  onBack: () => void
}

const propertyTypes = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'comercial', label: 'Imóvel comercial' },
  { value: 'area_externa', label: 'Área externa' },
  { value: 'outro', label: 'Outro' },
]

const conditions = [
  { value: 'sem_acabamento', label: 'Novo / sem acabamento' },
  { value: 'bom_estado', label: 'Usado em bom estado' },
  { value: 'reforma_parcial', label: 'Precisa reforma parcial' },
  { value: 'reforma_completa', label: 'Precisa reforma completa' },
  { value: 'nao_sei', label: 'Não sei informar' },
]

const roomOptions = [
  { value: 'cozinha', label: 'Cozinha' },
  { value: 'banheiro', label: 'Banheiro' },
  { value: 'sala_quartos', label: 'Sala / Quartos' },
  { value: 'fachada', label: 'Fachada' },
  { value: 'area_externa', label: 'Área externa' },
  { value: 'imovel_inteiro', label: 'Imóvel inteiro' },
]

const finishOptions = [
  { value: 'economico', label: 'Econômico', hint: 'Materiais simples, mão de obra básica' },
  { value: 'intermediario', label: 'Intermediário', hint: 'Materiais de média qualidade' },
  { value: 'alto_padrao', label: 'Alto padrão', hint: 'Materiais premium e acabamento refinado' },
]

const complexityOptions = [
  { value: 'baixa', label: 'Baixa', hint: 'Layout simples, obra direta' },
  { value: 'media', label: 'Média', hint: 'Alguns detalhes técnicos' },
  { value: 'alta', label: 'Alta', hint: 'Estrutura complexa' },
]

const timelineOptions = [
  { value: 'normal', label: 'Normal', hint: 'Sem prazo urgente' },
  { value: 'urgente', label: 'Urgente', hint: 'Início rápido necessário' },
]

const labelClass = 'mb-3 block text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/50'
const inputClass = 'w-full border border-[#2a2a28] bg-[#111110] px-4 py-3 text-sm text-brand-offwhite placeholder-brand-limestone/25 outline-none focus:border-brand-gold/50 transition'

function SelectGroup({ label, options, value, onChange }: {
  label: string
  options: { value: string; label: string; hint?: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="grid grid-cols-1 gap-px bg-[#2a2a28] sm:grid-cols-3">
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`p-4 text-left transition ${active ? 'bg-brand-gold/10' : 'bg-brand-concrete hover:bg-[#2a2a28]'}`}
            >
              <p className={`text-sm font-bold ${active ? 'text-brand-gold' : 'text-brand-offwhite'}`}>{opt.label}</p>
              {opt.hint && <p className={`mt-0.5 text-xs ${active ? 'text-brand-gold/60' : 'text-brand-limestone/40'}`}>{opt.hint}</p>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CheckGroup({ label, options, values, onChange }: {
  label: string
  options: { value: string; label: string }[]
  values: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(v: string) {
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
  }
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="grid grid-cols-2 gap-px bg-[#2a2a28] sm:grid-cols-3">
        {options.map((opt) => {
          const active = values.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`flex items-center gap-3 p-4 text-left transition ${active ? 'bg-brand-gold/10' : 'bg-brand-concrete hover:bg-[#2a2a28]'}`}
            >
              <div className={`h-4 w-4 shrink-0 border flex items-center justify-center ${active ? 'border-brand-gold bg-brand-gold' : 'border-[#3a3a38]'}`}>
                {active && (
                  <svg className="h-2.5 w-2.5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${active ? 'text-brand-gold' : 'text-brand-offwhite'}`}>{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function QuoteStepInputs({ serviceType, inputs, onChange, onNext, onBack }: QuoteStepInputsProps) {
  const hasArea = !['Banheiro/cozinha', 'Outro'].includes(serviceType)

  function canProceed() {
    if (hasArea && (!inputs.areaM2 || inputs.areaM2 <= 0)) return false
    if (!inputs.propertyType) return false
    return true
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold mb-3">Etapa 2 de 3</p>
      <h2 className="font-serif text-2xl font-bold text-brand-offwhite">Detalhes do projeto</h2>
      <p className="mt-2 text-sm text-brand-limestone/60">Quanto mais detalhes, mais precisa será a estimativa.</p>

      <div className="mt-8 flex flex-col gap-8">
        {/* Projeto */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold/60 border-b border-[#1e1e1c] pb-2">Projeto</p>
          <div className="flex flex-col gap-5">
            {hasArea && (
              <div>
                <label className={labelClass}>Metragem aproximada (m²)</label>
                <input
                  type="number"
                  min={1}
                  value={inputs.areaM2 || ''}
                  onChange={(e) => onChange({ areaM2: Number(e.target.value) })}
                  placeholder="Ex.: 80"
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <p className={labelClass}>Tipo de imóvel</p>
              <div className="grid grid-cols-2 gap-px bg-[#2a2a28] sm:grid-cols-5">
                {propertyTypes.map((opt) => {
                  const active = inputs.propertyType === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChange({ propertyType: opt.value })}
                      className={`p-3 text-center text-xs font-medium transition ${active ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-concrete text-brand-limestone/50 hover:bg-[#2a2a28]'}`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <p className={labelClass}>Condição atual do imóvel</p>
              <div className="grid grid-cols-1 gap-px bg-[#2a2a28] sm:grid-cols-5">
                {conditions.map((opt) => {
                  const active = inputs.currentCondition === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChange({ currentCondition: opt.value })}
                      className={`p-3 text-center text-xs font-medium transition ${active ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-concrete text-brand-limestone/50 hover:bg-[#2a2a28]'}`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Escopo */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold/60 border-b border-[#1e1e1c] pb-2">Escopo</p>
          <div className="flex flex-col gap-5">
            <CheckGroup
              label="Ambientes envolvidos"
              options={roomOptions}
              values={inputs.rooms}
              onChange={(v) => onChange({ rooms: v })}
            />
            <div>
              <p className={labelClass}>O que será incluído</p>
              <div className="grid grid-cols-1 gap-px bg-[#2a2a28] sm:grid-cols-2">
                {[
                  { key: 'includesDemolition', label: 'Demolição' },
                  { key: 'includesElectrical', label: 'Instalação elétrica' },
                  { key: 'includesPlumbing', label: 'Instalação hidráulica' },
                  { key: 'includesPainting', label: 'Pintura' },
                  { key: 'includesFlooring', label: 'Piso / Revestimento' },
                ].map(({ key, label }) => {
                  const active = inputs[key as keyof QuoteInputs] as boolean
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onChange({ [key]: !active })}
                      className={`flex items-center gap-3 p-4 text-left transition ${active ? 'bg-brand-gold/10' : 'bg-brand-concrete hover:bg-[#2a2a28]'}`}
                    >
                      <div className={`h-4 w-4 shrink-0 border flex items-center justify-center ${active ? 'border-brand-gold bg-brand-gold' : 'border-[#3a3a38]'}`}>
                        {active && (
                          <svg className="h-2.5 w-2.5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${active ? 'text-brand-gold' : 'text-brand-offwhite'}`}>{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Acabamento */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold/60 border-b border-[#1e1e1c] pb-2">Acabamento e complexidade</p>
          <div className="flex flex-col gap-5">
            <SelectGroup
              label="Padrão de acabamento"
              options={finishOptions}
              value={inputs.finishStandard}
              onChange={(v) => onChange({ finishStandard: v as QuoteInputs['finishStandard'] })}
            />
            <SelectGroup
              label="Complexidade percebida"
              options={complexityOptions}
              value={inputs.complexity}
              onChange={(v) => onChange({ complexity: v as QuoteInputs['complexity'] })}
            />
          </div>
        </div>

        {/* Prazo */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold/60 border-b border-[#1e1e1c] pb-2">Prazo</p>
          <SelectGroup
            label="Urgência do início"
            options={timelineOptions}
            value={inputs.timeline}
            onChange={(v) => onChange({ timeline: v as QuoteInputs['timeline'] })}
          />
        </div>

        {/* Observações */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold/60 border-b border-[#1e1e1c] pb-2">Observações</p>
          <label className={labelClass}>Detalhes adicionais (opcional)</label>
          <textarea
            value={inputs.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            rows={3}
            placeholder="Descreva detalhes relevantes da obra, materiais específicos ou condicionantes do local..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#2a2a28] px-6 py-3.5 text-sm font-semibold text-brand-limestone/60 transition hover:border-brand-limestone/30 hover:text-brand-limestone"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed()}
          className="flex-1 border border-brand-gold bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-dark transition hover:bg-[#c9a76a] disabled:opacity-40"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
