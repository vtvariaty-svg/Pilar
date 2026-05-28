import type { Timestamp } from 'firebase/firestore'

export type LeadStatus =
  | 'novo'
  | 'em_atendimento'
  | 'visita_agendada'
  | 'proposta_enviada'
  | 'fechado'
  | 'perdido'

export interface Lead {
  id: string
  name: string
  phone: string
  city: string
  neighborhood: string
  serviceType: string
  description: string
  budgetRange: string
  desiredTimeline: string
  notes: string
  source: 'site' | 'calculator' | 'whatsapp' | 'admin'
  status: LeadStatus
  internalNotes: string
  tenantId?: string
  customerUid?: string
  quoteEstimateId?: string
  appointmentId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type LeadFormData = Omit<Lead, 'id' | 'source' | 'status' | 'internalNotes' | 'tenantId' | 'customerUid' | 'quoteEstimateId' | 'appointmentId' | 'createdAt' | 'updatedAt'>

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  visita_agendada: 'Visita agendada',
  proposta_enviada: 'Proposta enviada',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: 'bg-blue-100 text-blue-800',
  em_atendimento: 'bg-yellow-100 text-yellow-800',
  visita_agendada: 'bg-purple-100 text-purple-800',
  proposta_enviada: 'bg-orange-100 text-orange-800',
  fechado: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800',
}
