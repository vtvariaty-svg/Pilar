import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Lead, LeadFormData, LeadStatus } from '../types/Lead'

const DEFAULT_TENANT = 'pilar'
const LEGACY_COL = 'leads'

function tenantLeadsCol(tenantId: string) {
  return collection(db, `tenants/${tenantId}/leads`)
}

function leadDocRef(lead: Lead) {
  const col = lead.tenantId ? `tenants/${lead.tenantId}/leads` : LEGACY_COL
  return doc(db, col, lead.id)
}

export async function createLead(
  data: LeadFormData,
  opts?: { customerUid?: string; tenantId?: string; quoteEstimateId?: string; source?: Lead['source'] },
): Promise<string> {
  const tenantId = opts?.tenantId ?? DEFAULT_TENANT
  const ref = await addDoc(tenantLeadsCol(tenantId), {
    ...data,
    source: opts?.source ?? 'site',
    status: 'novo',
    internalNotes: '',
    tenantId,
    ...(opts?.customerUid ? { customerUid: opts.customerUid } : {}),
    ...(opts?.quoteEstimateId ? { quoteEstimateId: opts.quoteEstimateId } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getLeadById(tenantId: string, leadId: string): Promise<Lead | null> {
  const snap = await getDoc(doc(db, `tenants/${tenantId}/leads`, leadId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Lead
}

export function subscribeLeadById(
  tenantId: string,
  leadId: string,
  callback: (lead: Lead | null) => void,
): Unsubscribe {
  return onSnapshot(doc(db, `tenants/${tenantId}/leads`, leadId), (snap) =>
    callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as Lead) : null),
  )
}

export async function updateLeadFields(
  tenantId: string,
  leadId: string,
  fields: Partial<Omit<Lead, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/leads`, leadId), {
    ...fields,
    updatedAt: serverTimestamp(),
  })
}

export function subscribeLeads(callback: (leads: Lead[]) => void): Unsubscribe {
  let newLeads: Lead[] = []
  let oldLeads: Lead[] = []

  function emit() {
    const seen = new Set<string>()
    const merged: Lead[] = []
    for (const l of [...newLeads, ...oldLeads]) {
      if (!seen.has(l.id)) { seen.add(l.id); merged.push(l) }
    }
    merged.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    callback(merged)
  }

  const unsub1 = onSnapshot(
    query(tenantLeadsCol(DEFAULT_TENANT), orderBy('createdAt', 'desc')),
    (snap) => { newLeads = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead); emit() },
    () => emit(),
  )

  const unsub2 = onSnapshot(
    query(collection(db, LEGACY_COL), orderBy('createdAt', 'desc')),
    (snap) => { oldLeads = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead); emit() },
    () => emit(),
  )

  return () => { unsub1(); unsub2() }
}

export function subscribeCustomerLeads(
  customerUid: string,
  tenantId: string,
  callback: (leads: Lead[]) => void,
): Unsubscribe {
  const q = query(
    tenantLeadsCol(tenantId),
    where('customerUid', '==', customerUid),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead)),
  )
}

export async function updateLeadStatus(lead: Lead, status: LeadStatus): Promise<void> {
  await updateDoc(leadDocRef(lead), { status, updatedAt: serverTimestamp() })
}

export async function updateLeadNotes(lead: Lead, internalNotes: string): Promise<void> {
  await updateDoc(leadDocRef(lead), { internalNotes, updatedAt: serverTimestamp() })
}
