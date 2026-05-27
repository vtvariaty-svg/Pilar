import {
  collection, addDoc, doc, updateDoc,
  query, orderBy, where, serverTimestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Appointment, AppointmentStatus } from '../types/Appointment'

const DEFAULT_TENANT = 'pilar'

function tenantAppCol(tenantId: string) {
  return collection(db, `tenants/${tenantId}/appointments`)
}

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
  customerUid?: string
  tenantId?: string
}

export async function createAppointment(data: AppointmentFormData): Promise<string> {
  const tenantId = data.tenantId ?? DEFAULT_TENANT
  const ref = await addDoc(tenantAppCol(tenantId), {
    ...data,
    endTime: data.startTime,
    status: 'solicitado',
    internalNotes: '',
    tenantId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export function subscribeAppointments(cb: (items: Appointment[]) => void): Unsubscribe {
  const q = query(tenantAppCol(DEFAULT_TENANT), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment)))
}

export function subscribeCustomerAppointments(
  customerUid: string,
  tenantId: string,
  cb: (items: Appointment[]) => void,
): Unsubscribe {
  const q = query(
    tenantAppCol(tenantId),
    where('customerUid', '==', customerUid),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment)))
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, tenantId = DEFAULT_TENANT): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/appointments`, id), { status, updatedAt: serverTimestamp() })
}

export async function updateAppointmentNotes(id: string, internalNotes: string, tenantId = DEFAULT_TENANT): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/appointments`, id), { internalNotes, updatedAt: serverTimestamp() })
}
