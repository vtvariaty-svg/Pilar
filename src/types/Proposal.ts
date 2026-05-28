import type { Timestamp } from 'firebase/firestore'

export type ProposalStatus = 'rascunho' | 'enviada' | 'aceita' | 'recusada' | 'cancelada'

export interface ProposalItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

export interface Proposal {
  id: string
  tenantId: string
  leadId: string
  quoteEstimateId?: string
  appointmentId?: string
  customerUid?: string
  title: string
  description: string
  status: ProposalStatus
  items: ProposalItem[]
  subtotal: number
  discount?: number
  total: number
  paymentTerms?: string
  executionDeadline?: string
  warrantyInfo?: string
  notes?: string
  validUntil?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  sentAt?: Timestamp
  acceptedAt?: Timestamp
  rejectedAt?: Timestamp
}

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  rascunho: 'Rascunho',
  enviada: 'Enviada',
  aceita: 'Aceita',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
}

export const PROPOSAL_STATUS_COLORS: Record<ProposalStatus, string> = {
  rascunho: 'bg-neutral-100 text-neutral-600',
  enviada: 'bg-blue-100 text-blue-800',
  aceita: 'bg-green-100 text-green-800',
  recusada: 'bg-red-100 text-red-800',
  cancelada: 'bg-neutral-200 text-neutral-500',
}
