import type { Timestamp } from 'firebase/firestore'

export interface Customer {
  uid: string
  tenantId: string
  email: string
  name: string
  phone: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
