import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { PlatformSettings } from '../types/PlatformSettings'
import { env } from '../utils/env'

const DEFAULT_TENANT = 'pilar'

export const DEFAULT_PLATFORM: Omit<PlatformSettings, 'id' | 'updatedAt'> = {
  companyName: env.companyName,
  serviceRegion: env.serviceRegion,
  whatsappNumber: env.whatsappNumber,
  instagramUrl: env.instagramUrl,
  yearsExperience: env.yearsExperience,
  estimateDisclaimer: 'Esta é uma estimativa inicial baseada nos dados informados. O valor real pode variar conforme visita técnica, especificações detalhadas e condições do local.',
  businessHours: 'Segunda a sexta, 8h às 18h',
}

function settingsDocRef(tenantId: string) {
  return doc(db, `tenants/${tenantId}/settings`, 'main')
}

export async function getPlatformSettings(tenantId = DEFAULT_TENANT): Promise<PlatformSettings> {
  const snap = await getDoc(settingsDocRef(tenantId))
  if (!snap.exists()) return { id: 'main', ...DEFAULT_PLATFORM, updatedAt: null as never }
  return { id: snap.id, ...snap.data() } as PlatformSettings
}

export async function savePlatformSettings(
  data: Omit<PlatformSettings, 'id' | 'updatedAt'>,
  tenantId = DEFAULT_TENANT,
): Promise<void> {
  await setDoc(settingsDocRef(tenantId), { ...data, updatedAt: serverTimestamp() })
}
