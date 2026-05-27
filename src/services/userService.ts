import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { UserProfile } from '../types/UserProfile'

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as UserProfile
}

export async function createUserProfile(
  uid: string,
  data: { email: string; name: string; phone?: string },
): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    globalRole: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
