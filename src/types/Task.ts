import type { Timestamp } from 'firebase/firestore'

export type TaskType =
  | 'contact_new_lead'
  | 'confirm_appointment'
  | 'follow_up_quote'
  | 'follow_up_proposal'
  | 'prepare_proposal'
  | 'start_project'
  | 'manual'

export type TaskStatus = 'open' | 'in_progress' | 'done' | 'cancelled'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  tenantId: string

  leadId?: string
  quoteEstimateId?: string
  appointmentId?: string
  proposalId?: string
  customerUid?: string

  type: TaskType
  title: string
  description?: string

  status: TaskStatus
  priority: TaskPriority

  dueAt?: Timestamp
  completedAt?: Timestamp

  assignedTo?: string
  createdBy?: string
  uniqueKey?: string

  createdAt: Timestamp
  updatedAt: Timestamp
}

export type TaskFormData = Omit<Task, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'completedAt'>

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  contact_new_lead: 'Responder pedido',
  confirm_appointment: 'Confirmar visita',
  follow_up_quote: 'Follow-up estimativa',
  follow_up_proposal: 'Follow-up proposta',
  prepare_proposal: 'Preparar proposta',
  start_project: 'Iniciar projeto',
  manual: 'Manual',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: 'Aberta',
  in_progress: 'Em andamento',
  done: 'Concluída',
  cancelled: 'Cancelada',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-neutral-100 text-neutral-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
  cancelled: 'bg-neutral-100 text-neutral-500',
}
