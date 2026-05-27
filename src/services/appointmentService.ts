import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, orderBy, serverTimestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Appointment, AppointmentStatus } from '../types/Appointment'

const COL = 'appointments'

export interface AppointmentFormData {
  clientName: string
  phone: string
  city: string
  neighborhood: string
  address?: string
  serviceType: string
  quoteEstimateId?: string
  date: string
  startTime: string
  notes?: string
}

export async function createAppointment(data: AppointmentFormData): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    endTime: data.startTime,
    status: 'solicitado',
    internalNotes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export function subscribeAppointments(cb: (items: Appointment[]) => void): Unsubscribe {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment))  )
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() })
}

export async function updateAppointmentNotes(id: string, internalNotes: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { internalNotes, updatedAt: serverTimestamp() })
}

export async function getAppointments(): Promise<Appointment[]> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment)
}
