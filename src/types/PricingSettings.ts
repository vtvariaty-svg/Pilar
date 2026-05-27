import type { Timestamp } from 'firebase/firestore'

export interface FinishStandardMultipliers {
  economico: number
  intermediario: number
  alto_padrao: number
}

export interface ComplexityMultipliers {
  baixa: number
  media: number
  alta: number
}

export interface UrgencyMultipliers {
  normal: number
  urgente: number
}

export interface PricingAdditions {
  demolition: number
  electrical: number
  plumbing: number
  paintingPerM2: number
  flooringPerM2: number
}

export interface PricingSettings {
  id: string
  serviceType: string
  active: boolean
  unit: 'm2' | 'unidade' | 'projeto'
  basePricePerM2: number
  minimumPrice: number
  uncertaintyPercent: number
  finishStandardMultipliers: FinishStandardMultipliers
  complexityMultipliers: ComplexityMultipliers
  urgencyMultipliers: UrgencyMultipliers
  additions: PricingAdditions
  updatedAt: Timestamp
  updatedBy: string
}
