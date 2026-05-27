import {
  collection, addDoc, doc, updateDoc,
  query, orderBy, where, serverTimestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { QuoteEstimate, QuoteStatus, QuoteClient, QuoteInputs, QuoteCalculation } from '../types/QuoteEstimate'

const DEFAULT_TENANT = 'pilar'

function tenantQuotesCol(tenantId: string) {
  return collection(db, `tenants/${tenantId}/quoteEstimates`)
}

export async function createQuoteEstimate(data: {
  client: QuoteClient
  serviceType: string
  inputs: QuoteInputs
  calculation: QuoteCalculation
  customerUid?: string
  tenantId?: string
}): Promise<string> {
  const tenantId = data.tenantId ?? DEFAULT_TENANT
  const ref = await addDoc(tenantQuotesCol(tenantId), {
    client: data.client,
    serviceType: data.serviceType,
    inputs: data.inputs,
    calculation: data.calculation,
    status: 'estimativa_criada',
    source: 'calculator',
    tenantId,
    ...(data.customerUid ? { customerUid: data.customerUid } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export function subscribeQuoteEstimates(cb: (items: QuoteEstimate[]) => void): Unsubscribe {
  const q = query(tenantQuotesCol(DEFAULT_TENANT), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuoteEstimate)))
}

export function subscribeCustomerQuotes(
  customerUid: string,
  tenantId: string,
  cb: (items: QuoteEstimate[]) => void,
): Unsubscribe {
  const q = query(
    tenantQuotesCol(tenantId),
    where('customerUid', '==', customerUid),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuoteEstimate)))
}

export async function updateQuoteStatus(id: string, status: QuoteStatus, tenantId = DEFAULT_TENANT): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/quoteEstimates`, id), { status, updatedAt: serverTimestamp() })
}
