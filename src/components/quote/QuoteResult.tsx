import { CheckCircle2, Calendar, MessageCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
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
  onRestart: () => void
}

const CONFIDENCE_LABELS = {
  alta: { label: 'Alta confiança', color: 'text-green-700 bg-green-50 border-green-200' },
  media: { label: 'Confiança média', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  baixa: { label: 'Baixa confiança', color: 'text-red-700 bg-red-50 border-red-200' },
}

export default function QuoteResult({ serviceType, inputs, client, calculation, onScheduleVisit, onRestart }: QuoteResultProps) {
  const [showDetails, setShowDetails] = useState(false)

  const conf = CONFIDENCE_LABELS[calculation.confidence]

  const whatsappMessage = [
    `Olá! Acabei de calcular uma estimativa no site da ${env.companyName}.`,
    ``,
    `*Serviço:* ${serviceType}`,
    inputs.areaM2 ? `*Área:* ${inputs.areaM2} m²` : '',
    `*Estimativa:* ${formatCurrency(calculation.estimatedLow)} – ${formatCurrency(calculation.estimatedHigh)}`,
    ``,
    `*Meu contato:*`,
    `Nome: ${client.name}`,
    `Telefone: ${client.phone}`,
    `Cidade: ${client.city}`,
    client.neighborhood ? `Bairro: ${client.neighborhood}` : '',
    ``,
    `Gostaria de conversar sobre um orçamento detalhado.`,
  ]
    .filter((l) => l !== undefined && l !== null && !(l === '' && false))
    .join('\n')

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-neutral-950">Sua estimativa está pronta</h2>
          <p className="text-sm text-neutral-500">{serviceType}</p>
        </div>
      </div>

      {/* Range card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Faixa estimada</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-neutral-950">{formatCurrency(calculation.estimatedMid)}</span>
          <span className="mb-0.5 text-sm text-neutral-500">valor provável</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-medium">Mínimo: {formatCurrency(calculation.estimatedLow)}</span>
          <span className="text-neutral-300">|</span>
          <span className="font-medium">Máximo: {formatCurrency(calculation.estimatedHigh)}</span>
        </div>

        <div className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${conf.color}`}>
          <span>{conf.label}</span>
        </div>
      </div>

      {/* Breakdown toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        <span>Ver fatores utilizados</span>
        {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {showDetails && (
        <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-4 text-sm">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Base de cálculo</p>
            <p className="mt-1 text-neutral-700">
              {inputs.areaM2 ? `${inputs.areaM2} m² × valor base` : 'Valor mínimo do serviço'} = {formatCurrency(calculation.basePrice)}
            </p>
          </div>

          {calculation.multipliers.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Multiplicadores</p>
              <ul className="mt-1 flex flex-col gap-1">
                {calculation.multipliers.map((m) => (
                  <li key={m.key} className="flex justify-between text-neutral-700">
                    <span>{m.label}</span>
                    <span className="font-medium">{m.value > 1 ? '+' : ''}{Math.round((m.value - 1) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {calculation.additions.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Serviços adicionais</p>
              <ul className="mt-1 flex flex-col gap-1">
                {calculation.additions.map((a) => (
                  <li key={a.key} className="flex justify-between text-neutral-700">
                    <span>{a.label}</span>
                    <span className="font-medium">+{formatCurrency(a.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 flex gap-2 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
        <p className="text-xs text-yellow-800">
          Esta é uma <strong>estimativa inicial</strong>, não um orçamento formal. O valor real pode variar conforme visita técnica, condições do imóvel e especificações definitivas do projeto.
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onScheduleVisit}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
        >
          <Calendar className="h-4 w-4" />
          Agendar visita técnica gratuita
        </button>
        <a
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 px-5 py-3.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
        >
          <MessageCircle className="h-4 w-4 text-green-600" />
          Continuar pelo WhatsApp
        </a>
        <button
          onClick={onRestart}
          className="text-center text-xs text-neutral-400 underline hover:text-neutral-600"
        >
          Calcular nova estimativa
        </button>
      </div>
    </div>
  )
}
