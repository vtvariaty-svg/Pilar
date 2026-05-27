import { collection, doc, getDoc, setDoc, onSnapshot, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import type { Customer } from '../types/Customer'

const DEFAULT_TENANT = 'pilar'

function tenantCustomersCol(tenantId: string) {
  return collection(db, `tenants/${tenantId}/customers`)
}

export async function getCustomer(tenantId: string, uid: string): Promise<Customer | null> {
  const snap = await getDoc(doc(db, `tenants/${tenantId}/customers`, uid))
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as Customer
}

export async function createCustomer(
  uid: string,
  data: { email: string; name: string; phone: string; tenantId?: string },
): Promise<void> {
  const tenantId = data.tenantId ?? DEFAULT_TENANT
  await setDoc(doc(db, `tenants/${tenantId}/customers`, uid), {
    uid,
    tenantId,
    email: data.email,
    name: data.name,
    phone: data.phone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeCustomers(cb: (customers: Customer[]) => void, tenantId = DEFAULT_TENANT): Unsubscribe {
  return onSnapshot(tenantCustomersCol(tenantId), (snap) =>
    cb(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as Customer)),
  )
}
