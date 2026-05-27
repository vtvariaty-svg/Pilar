import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { TenantMember, TenantRole } from '../types/TenantMember'

export async function getTenantMember(tenantId: string, uid: string): Promise<TenantMember | null> {
  const snap = await getDoc(doc(db, `tenants/${tenantId}/members`, uid))
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as TenantMember
}

export async function setTenantMember(
  tenantId: string,
  uid: string,
  role: TenantRole,
  extra?: { displayName?: string; email?: string },
): Promise<void> {
  await setDoc(doc(db, `tenants/${tenantId}/members`, uid), {
    uid,
    tenantId,
    role,
    ...extra,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
