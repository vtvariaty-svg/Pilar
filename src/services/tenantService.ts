import { collection, doc, getDoc, getDocs, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import type { Tenant } from '../types/Tenant'

export async function getTenants(): Promise<Tenant[]> {
  const snap = await getDocs(collection(db, 'tenants'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tenant)
}

export async function getTenant(tenantId: string): Promise<Tenant | null> {
  const snap = await getDoc(doc(db, 'tenants', tenantId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Tenant
}

export function subscribeTenants(cb: (tenants: Tenant[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'tenants'), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tenant)),
  )
}
