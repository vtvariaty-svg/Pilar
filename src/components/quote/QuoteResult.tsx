import { useState } from 'react'
import { ArrowRight, MessageCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import type { QuoteCalculation, QuoteClient, QuoteInputs } from '../../types/QuoteEstimate'
import { formatCurrency } from '../../services/quoteCalculator'
import { whatsappLink } from '../../utils/whatsapp'
import { env } from '../../utils/env'

interface QuoteResultProps {
  serviceType: string
  inputs: QuoteInputs
  client: QuoteClient
  calculation: QuoteCalculation
  onScheduleVisit: () => void
  onRequestAnalysis: () => void
  onRestart: () => void
  isLoggedIn?: boolean
  isSavingAnalysis?: boolean
}

const CONFIDENCE_CONFIG = {
  alta: { label: 'Alta confiança', bar: 'w-4/5', color: 'text-green-400', bg: 'bg-green-400/10 border-green-500/20' },
  media: { label: 'Confiança média', bar: 'w-3/5', color: 'text-brand-gold', bg: 'bg-brand-gold/10 border-brand-gold/20' },
  baixa: { label: 'Confiança baixa', bar: 'w-2/5', color: 'text-red-400', bg: 'bg-red-900/20 border-red-700/20' },
}

const PROPERTY_LABELS: Record<string, string> = {
  casa: 'Casa', apartamento: 'Apartamento', comercial: 'Imóvel comercial',
  area_externa: 'Área externa', outro: 'Outro',
}

const CONDITION_LABELS: Record<string, string> = {
  sem_acabamento: 'Novo / sem acabamento', bom_estado: 'Bom estado',
  reforma_parcial: 'Reforma parcial', reforma_completa: 'Reforma completa', nao_sei: 'Não informado',
}

const FINISH_LABELS: Record<string, string> = {
  economico: 'Econômico', intermediario: 'Intermediário', alto_padrao: 'Alto padrão',
}

export default function QuoteResult({ serviceType, inputs, client, calculation, onScheduleVisit, onRequestAnalysis, onRestart, isLoggedIn, isSavingAnalysis }: QuoteResultProps) {
  const [showDetails, setShowDetails] = useState(false)

  const conf = CONFIDENCE_CONFIG[calculation.confidence]

  const whatsappMessage = [
    `Olá! Calculei uma estimativa no site da ${env.companyName}.`,
    ``,
    `*Serviço:* ${serviceType}`,
    inputs.areaM2 ? `*Área:* ${inputs.areaM2} m²` : '',
    `*Estimativa:* ${formatCurrency(calculation.estimatedLow)} – ${formatCurrency(calculation.estimatedHigh)}`,
    ``,
    `*Meu contato:* ${client.name} — ${client.phone}`,
    `*Cidade:* ${client.city}${client.neighborhood ? `, ${client.neighborhood}` : ''}`,
    ``,
    `Gostaria de agendar uma visita técnica.`,
  ].filter(Boolean).join('\n')

  const dataSummary = [
    { label: 'Serviço', value: serviceType },
    inputs.propertyType ? { label: 'Imóvel', value: PROPERTY_LABELS[inputs.propertyType] ?? inputs.propertyType } : null,
    inputs.currentCondition ? { label: 'Condição', value: CONDITION_LABELS[inputs.currentCondition] ?? inputs.currentCondition } : null,
    inputs.areaM2 ? { label: 'Metragem', value: `${inputs.areaM2} m²` } : null,
    { label: 'Acabamento', value: FINISH_LABELS[inputs.finishStandard] ?? inputs.finishStandard },
    { label: 'Complexidade', value: inputs.complexity === 'baixa' ? 'Baixa' : inputs.complexity === 'media' ? 'Média' : 'Alta' },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold mb-4">Prévia de estimativa</p>
      <h2 className="font-serif text-2xl font-bold text-brand-offwhite mb-2">Estimativa inicial calculada.</h2>
      <p className="text-sm text-brand-limestone/50 mb-8">
        {client.name}, confira os valores abaixo. Esta é uma análise preliminar baseada nos dados informados.
      </p>

      {/* Faixa de valores */}
      <div className="bg-brand-concrete border border-[#2a2a28] p-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/40 mb-4">Faixa estimada</p>
        <div className="grid grid-cols-3 gap-px bg-[#2a2a28]">
          <div className="bg-brand-dark p-4 text-center">
            <p className="text-xs text-brand-limestone/40 mb-1 uppercase tracking-wider">Mínimo</p>
            <p className="font-serif text-lg font-bold text-brand-limestone">{formatCurrency(calculation.estimatedLow)}</p>
          </div>
          <div className="bg-[#111110] p-4 text-center border-x border-brand-gold/20">
            <p className="text-xs text-brand-gold/60 mb-1 uppercase tracking-wider">Provável</p>
            <p className="font-serif text-2xl font-bold text-brand-gold">{formatCurrency(calculation.estimatedMid)}</p>
          </div>
          <div className="bg-brand-dark p-4 text-center">
            <p className="text-xs text-brand-limestone/40 mb-1 uppercase tracking-wider">Máximo</p>
            <p className="font-serif text-lg font-bold text-brand-limestone">{formatCurrency(calculation.estimatedHigh)}</p>
          </div>
        </div>

        {/* Confiança */}
        <div className={`mt-4 flex items-center gap-3 border px-4 py-2.5 ${conf.bg}`}>
          <div className="flex-1 h-1 bg-[#1e1e1c]">
            <div className={`h-full ${conf.bar} bg-current ${conf.color} transition-all`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${conf.color}`}>{conf.label}</span>
        </div>
      </div>

      {/* Dados considerados */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between border border-[#2a2a28] bg-brand-concrete px-5 py-3.5 text-sm font-medium text-brand-limestone/60 transition hover:text-brand-limestone"
        >
          <span>Ver dados e fatores considerados</span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showDetails && (
          <div className="border border-t-0 border-[#2a2a28] bg-[#111110] p-5">
            <div className="grid grid-cols-2 gap-3 mb-5">
              {dataSummary.map((d) => (
                <div key={d.label}>
                  <p className="text-xs text-brand-limestone/30 uppercase tracking-wider">{d.label}</p>
                  <p className="text-sm font-medium text-brand-offwhite mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>

            {calculation.multipliers.length > 0 && (
              <div className="border-t border-[#1e1e1c] pt-4 mb-4">
                <p className="text-xs text-brand-limestone/30 uppercase tracking-wider mb-2">Multiplicadores aplicados</p>
                {calculation.multipliers.map((m) => (
                  <div key={m.key} className="flex justify-between text-sm text-brand-limestone/60 py-1">
                    <span>{m.label}</span>
                    <span className="font-medium text-brand-gold/60">{m.value > 1 ? '+' : ''}{Math.round((m.value - 1) * 100)}%</span>
                  </div>
                ))}
              </div>
            )}

            {calculation.additions.length > 0 && (
              <div className="border-t border-[#1e1e1c] pt-4">
                <p className="text-xs text-brand-limestone/30 uppercase tracking-wider mb-2">Serviços adicionais</p>
                {calculation.additions.map((a) => (
                  <div key={a.key} className="flex justify-between text-sm text-brand-limestone/60 py-1">
                    <span>{a.label}</span>
                    <span className="font-medium text-brand-gold/60">+{formatCurrency(a.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mb-6 border border-[#2a2a28] bg-brand-concrete px-5 py-4">
        <p className="text-xs leading-5 text-brand-limestone/40">
          <strong className="text-brand-limestone/60">Estimativa inicial.</strong>{' '}
          Esta prévia não substitui visita técnica ou proposta formal. O valor real pode variar conforme condições do imóvel, especificações técnicas e preços de mercado no período de execução.
        </p>
      </div>

      {/* Próximos passos */}
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/30 mb-3">Próximos passos</p>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onRequestAnalysis}
          disabled={isSavingAnalysis}
          className="flex items-center justify-center gap-2 border border-brand-gold bg-brand-gold px-6 py-4 text-sm font-bold text-brand-dark transition hover:bg-[#c9a76a] disabled:opacity-60"
        >
          {isSavingAnalysis ? (
            <span className="h-4 w-4 animate-spin border-2 border-brand-dark/30 border-t-brand-dark" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {isLoggedIn ? 'Solicitar análise técnica' : 'Solicitar análise (criar conta)'}
        </button>

        <button
          type="button"
          onClick={onScheduleVisit}
          className="flex items-center justify-center gap-2 border border-[#2a2a28] px-6 py-4 text-sm font-semibold text-brand-limestone/60 transition hover:border-brand-limestone/30 hover:text-brand-limestone"
        >
          <Calendar className="h-4 w-4" />
          Agendar visita técnica
        </button>

        <a
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 border border-[#2a2a28] px-6 py-4 text-sm font-semibold text-brand-limestone/60 transition hover:border-green-600/30 hover:text-green-400"
        >
          <MessageCircle className="h-4 w-4 text-green-500" />
          Continuar pelo WhatsApp
        </a>

        <button
          type="button"
          onClick={onRestart}
          className="text-center text-xs text-brand-limestone/25 hover:text-brand-limestone/50 transition pt-2"
        >
          Calcular nova estimativa
        </button>
      </div>
    </div>
  )
}
