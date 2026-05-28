import type { QuoteInputs, QuoteCalculation, QuoteAddition, QuoteMultiplier } from '../types/QuoteEstimate'
import type { PricingSettings } from '../types/PricingSettings'
import { DEFAULT_PRICING } from '../data/defaultPricingSettings'

export function getDefaultSettings(serviceType: string): PricingSettings {
  return DEFAULT_PRICING.find((s) => s.serviceType === serviceType) ?? DEFAULT_PRICING[1]
}

const CONDITION_MULTIPLIERS: Record<string, number> = {
  'bom_estado': 1.0,
  'reforma_parcial': 1.05,
  'reforma_completa': 1.10,
  'sem_acabamento': 1.08,
  'nao_sei': 1.0,
}

export function calculateQuoteEstimate(
  inputs: QuoteInputs,
  serviceType: string,
  settings: PricingSettings,
): QuoteCalculation {
  const {
    areaM2, finishStandard, complexity, timeline, currentCondition,
    includesDemolition, includesElectrical, includesPlumbing,
    includesPainting, includesFlooring,
  } = inputs

  const basePrice = Math.max(areaM2 * settings.basePricePerM2, settings.minimumPrice)

  const multipliers: QuoteMultiplier[] = []

  const finishMult = settings.finishStandardMultipliers[finishStandard]
  if (finishMult !== 1) {
    multipliers.push({
      key: 'finish',
      label: finishStandard === 'economico' ? 'Padrão econômico' : finishStandard === 'intermediario' ? 'Padrão intermediário' : 'Alto padrão',
      value: finishMult,
    })
  }

  const complexMult = settings.complexityMultipliers[complexity]
  if (complexMult !== 1) {
    multipliers.push({
      key: 'complexity',
      label: complexity === 'baixa' ? 'Baixa complexidade' : complexity === 'media' ? 'Complexidade média' : 'Alta complexidade',
      value: complexMult,
    })
  }

  const urgencyMult = settings.urgencyMultipliers[timeline]
  if (urgencyMult !== 1) {
    multipliers.push({ key: 'urgency', label: 'Urgência', value: urgencyMult })
  }

  const condMult = CONDITION_MULTIPLIERS[currentCondition] ?? 1.0
  if (condMult !== 1.0) {
    const condLabel =
      currentCondition === 'reforma_parcial' ? 'Condição: reforma parcial' :
      currentCondition === 'reforma_completa' ? 'Condição: reforma completa' :
      currentCondition === 'sem_acabamento' ? 'Condição: sem acabamento' : 'Condição do imóvel'
    multipliers.push({ key: 'condition', label: condLabel, value: condMult })
  }

  const totalMultiplier = multipliers.reduce((acc, m) => acc * m.value, 1)
  const multipliedPrice = basePrice * totalMultiplier

  const additions: QuoteAddition[] = []
  if (includesDemolition) additions.push({ key: 'demolition', label: 'Demolição', value: settings.additions.demolition })
  if (includesElectrical) additions.push({ key: 'electrical', label: 'Instalação elétrica', value: settings.additions.electrical })
  if (includesPlumbing) additions.push({ key: 'plumbing', label: 'Instalação hidráulica', value: settings.additions.plumbing })
  if (includesPainting) additions.push({ key: 'painting', label: 'Pintura', value: Math.round(areaM2 * settings.additions.paintingPerM2) })
  if (includesFlooring) additions.push({ key: 'flooring', label: 'Piso/revestimento', value: Math.round(areaM2 * settings.additions.flooringPerM2) })

  const totalAdditions = additions.reduce((acc, a) => acc + a.value, 0)
  const estimatedMid = Math.round(multipliedPrice + totalAdditions)

  const unc = settings.uncertaintyPercent / 100
  const estimatedLow = Math.round(estimatedMid * (1 - unc))
  const estimatedHigh = Math.round(estimatedMid * (1 + unc))

  let confidence: 'baixa' | 'media' | 'alta' = 'media'
  if (areaM2 > 300 || complexity === 'alta' || serviceType === 'Outro' || currentCondition === 'nao_sei') confidence = 'baixa'
  else if (areaM2 >= 20 && complexity === 'baixa') confidence = 'alta'

  return { basePrice, additions, multipliers, estimatedLow, estimatedMid, estimatedHigh, confidence }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
