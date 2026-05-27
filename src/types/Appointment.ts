import type { Timestamp } from 'firebase/firestore'

export type AppointmentStatus =
  | 'solicitado'
  | 'confirmado'
  | 'remarcado'
  | 'cancelado'
  | 'realizado'

export interface Appointment {
  id: string
  clientName: string
  phone: string
  city: string
  neighborhood: string
  address?: string
  serviceType: string
  quoteEstimateId?: string
  leadId?: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  internalNotes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  solicitado: 'Solicitado',
  confirmado: 'Confirmado',
  remarcado: 'Remarcado',
  cancelado: 'Cancelado',
  realizado: 'Realizado',
}

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  solicitado: 'bg-blue-100 text-blue-800',
  confirmado: 'bg-green-100 text-green-800',
  remarcado: 'bg-yellow-100 text-yellow-800',
  cancelado: 'bg-red-100 text-red-800',
  realizado: 'bg-gray-100 text-gray-800',
}
