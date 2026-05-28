import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  getDocs,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task, TaskFormData, TaskStatus } from '../types/Task'

function tasksCol(tenantId: string) {
  return collection(db, `tenants/${tenantId}/tasks`)
}

function daysFromNow(days: number): Timestamp {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return Timestamp.fromDate(d)
}

export function hoursFromNow(hours: number): Timestamp {
  const d = new Date()
  d.setHours(d.getHours() + hours)
  return Timestamp.fromDate(d)
}

export async function createTask(
  tenantId: string,
  data: Omit<TaskFormData, 'status'> & { status?: TaskStatus },
  createdBy?: string,
): Promise<string> {
  const ref = await addDoc(tasksCol(tenantId), {
    ...data,
    tenantId,
    status: data.status ?? 'open',
    createdBy: createdBy ?? data.createdBy ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function createTaskIfNotExists(
  tenantId: string,
  uniqueKey: string,
  data: Omit<TaskFormData, 'status'> & { status?: TaskStatus },
  createdBy?: string,
): Promise<string | null> {
  const existing = await getDocs(
    query(tasksCol(tenantId), where('uniqueKey', '==', uniqueKey)),
  )
  if (!existing.empty) return null
  return createTask(tenantId, { ...data, uniqueKey }, createdBy)
}

export async function updateTask(
  tenantId: string,
  taskId: string,
  data: Partial<TaskFormData>,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/tasks`, taskId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function completeTask(
  tenantId: string,
  taskId: string,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/tasks`, taskId), {
    status: 'done' as TaskStatus,
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function cancelTask(
  tenantId: string,
  taskId: string,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/tasks`, taskId), {
    status: 'cancelled' as TaskStatus,
    updatedAt: serverTimestamp(),
  })
}

export function subscribeTasks(
  tenantId: string,
  callback: (tasks: Task[]) => void,
): Unsubscribe {
  const q = query(tasksCol(tenantId), orderBy('dueAt', 'asc'))
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Task)),
    (err) => { console.error('[subscribeTasks]', err); callback([]) },
  )
}

export function subscribeOpenTasks(
  tenantId: string,
  callback: (tasks: Task[]) => void,
): Unsubscribe {
  const q = query(
    tasksCol(tenantId),
    where('status', 'in', ['open', 'in_progress']),
    orderBy('dueAt', 'asc'),
  )
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Task)),
    (err) => { console.error('[subscribeOpenTasks]', err); callback([]) },
  )
}

export function subscribeTasksByLead(
  tenantId: string,
  leadId: string,
  callback: (tasks: Task[]) => void,
): Unsubscribe {
  const q = query(
    tasksCol(tenantId),
    where('leadId', '==', leadId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Task)),
    (err) => { console.error('[subscribeTasksByLead]', err); callback([]) },
  )
}

export { daysFromNow }
