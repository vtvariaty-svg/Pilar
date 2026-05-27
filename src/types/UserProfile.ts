import type { Timestamp } from 'firebase/firestore'

export type GlobalRole = 'platform_admin' | 'user'

export interface UserProfile {
  uid: string
  email: string
  name: string
  phone?: string
  globalRole: GlobalRole
  createdAt: Timestamp
  updatedAt: Timestamp
}
