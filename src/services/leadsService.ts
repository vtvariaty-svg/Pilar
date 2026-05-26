import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Lead, LeadFormData, LeadStatus } from '../types/Lead'

const COLLECTION = 'leads'

export async function createLead(data: LeadFormData): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    source: 'site',
    status: 'novo',
    internalNotes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getLeads(): Promise<Lead[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead)
}

export function subscribeLeads(callback: (leads: Lead[]) => void): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead)
    callback(leads)
  })
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function updateLeadNotes(id: string, internalNotes: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    internalNotes,
    updatedAt: serverTimestamp(),
  })
}
