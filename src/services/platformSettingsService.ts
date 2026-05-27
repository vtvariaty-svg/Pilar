import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { PlatformSettings } from '../types/PlatformSettings'
import { env } from '../utils/env'

const DOC_ID = 'main'
const COL = 'platformSettings'

export const DEFAULT_PLATFORM: Omit<PlatformSettings, 'id' | 'updatedAt'> = {
  companyName: env.companyName,
  serviceRegion: env.serviceRegion,
  whatsappNumber: env.whatsappNumber,
  instagramUrl: env.instagramUrl,
  yearsExperience: env.yearsExperience,
  estimateDisclaimer: 'Esta é uma estimativa inicial baseada nos dados informados. O valor real pode variar conforme visita técnica, especificações detalhadas e condições do local.',
  businessHours: 'Segunda a sexta, 8h às 18h',
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  const snap = await getDoc(doc(db, COL, DOC_ID))
  if (!snap.exists()) return { id: DOC_ID, ...DEFAULT_PLATFORM, updatedAt: null as never }
  return { id: snap.id, ...snap.data() } as PlatformSettings
}

export async function savePlatformSettings(data: Omit<PlatformSettings, 'id' | 'updatedAt'>): Promise<void> {
  await setDoc(doc(db, COL, DOC_ID), { ...data, updatedAt: serverTimestamp() })
}
