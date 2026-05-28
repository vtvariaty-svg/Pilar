import type { Timestamp } from 'firebase/firestore'

export type TimelineEventType =
  | 'quote_created'
  | 'lead_created'
  | 'appointment_requested'
  | 'appointment_confirmed'
  | 'status_changed'
  | 'proposal_created'
  | 'proposal_sent'
  | 'proposal_accepted'
  | 'proposal_rejected'
  | 'note_added'
  | 'closed'
  | 'lost'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  visibility: 'internal' | 'customer'
  createdAt: Timestamp
  createdBy?: string
}
