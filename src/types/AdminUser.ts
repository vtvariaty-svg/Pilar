import type { Timestamp } from 'firebase/firestore'

export type AdminRole = 'super_admin' | 'admin'

export interface AdminUser {
  uid: string
  email: string
  name?: string
  role: AdminRole
  active: boolean
  createdBy?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
