import type { Timestamp } from 'firebase/firestore'

export type TenantRole = 'owner' | 'admin' | 'operator' | 'viewer' | 'customer'

export interface TenantMember {
  uid: string
  tenantId: string
  role: TenantRole
  displayName?: string
  email?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const TENANT_ROLE_LABELS: Record<TenantRole, string> = {
  owner: 'Proprietário',
  admin: 'Administrador',
  operator: 'Operador',
  viewer: 'Visualizador',
  customer: 'Cliente',
}
