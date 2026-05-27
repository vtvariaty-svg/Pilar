import {
  collection, getDocs, doc, setDoc, serverTimestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db, auth } from './firebase'
import type { PricingSettings } from '../types/PricingSettings'
import { DEFAULT_PRICING } from '../data/defaultPricingSettings'

const DEFAULT_TENANT = 'pilar'

function tenantPricingCol(tenantId: string) {
  return collection(db, `tenants/${tenantId}/pricingSettings`)
}

export async function getPricingSettings(tenantId = DEFAULT_TENANT): Promise<PricingSettings[]> {
  const snap = await getDocs(tenantPricingCol(tenantId))
  if (snap.empty) return DEFAULT_PRICING
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PricingSettings)
}

export async function getPricingForService(serviceType: string, tenantId = DEFAULT_TENANT): Promise<PricingSettings> {
  const all = await getPricingSettings(tenantId)
  return all.find((s) => s.serviceType === serviceType) ?? DEFAULT_PRICING[1]
}

export function subscribePricingSettings(cb: (items: PricingSettings[]) => void, tenantId = DEFAULT_TENANT): Unsubscribe {
  return onSnapshot(tenantPricingCol(tenantId), (snap) => {
    if (snap.empty) { cb(DEFAULT_PRICING); return }
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PricingSettings))
  })
}

export async function savePricingSettings(settings: PricingSettings, tenantId = DEFAULT_TENANT): Promise<void> {
  const uid = auth.currentUser?.uid ?? 'admin'
  await setDoc(doc(db, `tenants/${tenantId}/pricingSettings`, settings.id), {
    ...settings,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  })
}
