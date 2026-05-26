import type { Timestamp } from 'firebase/firestore'

export function formatDate(timestamp: Timestamp | undefined): string {
  if (!timestamp) return '—'
  return timestamp.toDate().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateShort(timestamp: Timestamp | undefined): string {
  if (!timestamp) return '—'
  return timestamp.toDate().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
