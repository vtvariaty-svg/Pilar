// NOTE: Criação de usuário com senha temporária deve ser feita via Firebase Admin SDK /
// Cloud Functions. No MVP, o admin cria um convite e o usuário define a própria senha
// ao criar conta em /criar-conta. Reset de senha é feito via sendPasswordResetEmail.

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  type Unsubscribe,
  type Timestamp,
} from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from './firebase'
import { createAdminUser } from './adminUserService'
import { setTenantMember } from './membershipService'
import type { AdminUser } from '../types/AdminUser'
import type { UserProfile } from '../types/UserProfile'

const DEFAULT_TENANT = 'pilar'

export interface AdminInvite {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  status: 'pending' | 'accepted' | 'cancelled'
  createdBy: string
  createdAt: Timestamp | null
}

export function subscribeAllUsers(callback: (users: UserProfile[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'users'), (snap) =>
    callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserProfile)),
  )
}

export function subscribeCustomersUsers(
  tenantId: string,
  callback: (customers: UserProfile[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, `tenants/${tenantId}/customers`), (snap) =>
    callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserProfile)),
  )
}

export function subscribeAdminUsers(callback: (admins: AdminUser[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'adminUsers'), (snap) =>
    callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as AdminUser)),
  )
}

export function subscribeAdminInvites(callback: (invites: AdminInvite[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'adminInvites'), (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminInvite)),
  )
}

export async function createAdminInvite(
  email: string,
  role: 'admin' | 'super_admin',
  createdBy: string,
): Promise<void> {
  await addDoc(collection(db, 'adminInvites'), {
    email: email.trim().toLowerCase(),
    role,
    status: 'pending',
    createdBy,
    createdAt: serverTimestamp(),
  })
}

export async function cancelAdminInvite(inviteId: string): Promise<void> {
  await updateDoc(doc(db, 'adminInvites', inviteId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  })
}

export async function promoteUserToAdmin(
  uid: string,
  email: string,
  name: string,
  role: 'admin' | 'super_admin',
  createdBy: string,
): Promise<void> {
  await createAdminUser({ uid, email, name, role, active: true, createdBy })
  await setTenantMember(DEFAULT_TENANT, uid, role === 'super_admin' ? 'owner' : 'admin', {
    displayName: name,
    email,
  })
}

export async function deactivateAdmin(uid: string): Promise<void> {
  await updateDoc(doc(db, 'adminUsers', uid), {
    active: false,
    updatedAt: serverTimestamp(),
  })
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

export async function checkPendingInvite(
  email: string,
): Promise<{ id: string; role: 'admin' | 'super_admin' } | null> {
  const q = query(
    collection(db, 'adminInvites'),
    where('email', '==', email.trim().toLowerCase()),
    where('status', '==', 'pending'),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, role: d.data().role as 'admin' | 'super_admin' }
}

export async function acceptAdminInvite(inviteId: string): Promise<void> {
  await updateDoc(doc(db, 'adminInvites', inviteId), {
    status: 'accepted',
    acceptedAt: serverTimestamp(),
  })
}
