import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, orderBy, serverTimestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { QuoteEstimate, QuoteStatus, QuoteClient, QuoteInputs, QuoteCalculation } from '../types/QuoteEstimate'

const COL = 'quoteEstimates'

export async function createQuoteEstimate(data: {
  client: QuoteClient
  serviceType: string
  inputs: QuoteInputs
  calculation: QuoteCalculation
}): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    status: 'estimativa_criada',
    source: 'calculator',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getQuoteEstimates(): Promise<QuoteEstimate[]> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuoteEstimate)
}

export function subscribeQuoteEstimates(cb: (items: QuoteEstimate[]) => void): Unsubscribe {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuoteEstimate)))
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() })
}
