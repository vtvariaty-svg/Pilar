import {
  collection, getDocs, doc, setDoc, serverTimestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db, auth } from './firebase'
import type { PricingSettings } from '../types/PricingSettings'
import { DEFAULT_PRICING } from '../data/defaultPricingSettings'

const COL = 'pricingSettings'

export async function getPricingSettings(): Promise<PricingSettings[]> {
  const snap = await getDocs(collection(db, COL))
  if (snap.empty) return DEFAULT_PRICING
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PricingSettings)
}

export async function getPricingForService(serviceType: string): Promise<PricingSettings> {
  const all = await getPricingSettings()
  return all.find((s) => s.serviceType === serviceType) ?? DEFAULT_PRICING[1]
}

export function subscribePricingSettings(cb: (items: PricingSettings[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COL), (snap) => {
    if (snap.empty) { cb(DEFAULT_PRICING); return }
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PricingSettings))
  })
}

export async function savePricingSettings(settings: PricingSettings): Promise<void> {
  const uid = auth.currentUser?.uid ?? 'admin'
  await setDoc(doc(db, COL, settings.id), {
    ...settings,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  })
}
