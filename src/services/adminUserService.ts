import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import type { AdminUser, AdminRole } from '../types/AdminUser'

export async function getAdminUser(uid: string): Promise<AdminUser | null> {
  const snap = await getDoc(doc(db, 'adminUsers', uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() } as AdminUser
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const uid = auth.currentUser?.uid
  if (!uid) return false
  const adminUser = await getAdminUser(uid)
  return adminUser?.active === true
}

export async function createAdminUser(
  data: Omit<AdminUser, 'createdAt' | 'updatedAt'>,
): Promise<void> {
  await setDoc(doc(db, 'adminUsers', data.uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const snap = await getDocs(collection(db, 'adminUsers'))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as AdminUser)
}

export async function updateAdminUserRole(uid: string, role: AdminRole): Promise<void> {
  await updateDoc(doc(db, 'adminUsers', uid), { role, updatedAt: serverTimestamp() })
}

export async function deactivateAdminUser(uid: string): Promise<void> {
  await updateDoc(doc(db, 'adminUsers', uid), { active: false, updatedAt: serverTimestamp() })
}
