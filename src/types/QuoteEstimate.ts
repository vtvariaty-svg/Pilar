import type { Timestamp } from 'firebase/firestore'

export type QuoteStatus =
  | 'estimativa_criada'
  | 'aguardando_contato'
  | 'visita_solicitada'
  | 'em_atendimento'
  | 'proposta_enviada'
  | 'fechado'
  | 'perdido'

export interface QuoteAddition {
  key: string
  label: string
  value: number
}

export interface QuoteMultiplier {
  key: string
  label: string
  value: number
}

export interface QuoteCalculation {
  basePrice: number
  additions: QuoteAddition[]
  multipliers: QuoteMultiplier[]
  estimatedLow: number
  estimatedMid: number
  estimatedHigh: number
  confidence: 'baixa' | 'media' | 'alta'
}

export interface QuoteClient {
  name: string
  phone: string
  city: string
  neighborhood: string
}

export interface QuoteInputs {
  areaM2: number
  propertyType: string
  currentCondition: string
  finishStandard: 'economico' | 'intermediario' | 'alto_padrao'
  complexity: 'baixa' | 'media' | 'alta'
  timeline: 'normal' | 'urgente'
  includesDemolition: boolean
  includesElectrical: boolean
  includesPlumbing: boolean
  includesPainting: boolean
  includesFlooring: boolean
  notes: string
}

export interface QuoteEstimate {
  id: string
  client: QuoteClient
  serviceType: string
  inputs: QuoteInputs
  calculation: QuoteCalculation
  status: QuoteStatus
  source: 'calculator'
  tenantId?: string
  customerUid?: string
  leadId?: string
  appointmentId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  estimativa_criada: 'Estimativa criada',
  aguardando_contato: 'Aguardando contato',
  visita_solicitada: 'Visita solicitada',
  em_atendimento: 'Em atendimento',
  proposta_enviada: 'Proposta enviada',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

export const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  estimativa_criada: 'bg-blue-100 text-blue-800',
  aguardando_contato: 'bg-gray-100 text-gray-800',
  visita_solicitada: 'bg-purple-100 text-purple-800',
  em_atendimento: 'bg-yellow-100 text-yellow-800',
  proposta_enviada: 'bg-orange-100 text-orange-800',
  fechado: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800',
}
