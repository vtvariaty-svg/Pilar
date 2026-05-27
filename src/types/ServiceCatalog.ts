import type { Timestamp } from 'firebase/firestore'

export interface ServiceCatalog {
  id: string
  name: string
  description: string
  active: boolean
  icon: string
  order: number
  updatedAt: Timestamp
}
