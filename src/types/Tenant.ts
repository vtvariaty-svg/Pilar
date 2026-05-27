import type { Timestamp } from 'firebase/firestore'

export interface Tenant {
  id: string
  name: string
  slug: string
  email?: string
  phone?: string
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
