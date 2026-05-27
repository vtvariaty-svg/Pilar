import {
  collection, getDocs, doc, setDoc, serverTimestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { ServiceCatalog } from '../types/ServiceCatalog'

const COL = 'serviceCatalog'

const DEFAULT_SERVICES: ServiceCatalog[] = [
  { id: 'construcao-zero', name: 'Construção do zero', description: 'Casas, sobrados e imóveis comerciais do alicerce ao acabamento.', active: true, icon: 'Home', order: 1, updatedAt: null as never },
  { id: 'reforma-completa', name: 'Reforma completa', description: 'Reforma geral de casas, apartamentos e áreas comerciais.', active: true, icon: 'Wrench', order: 2, updatedAt: null as never },
  { id: 'ampliacao', name: 'Ampliação', description: 'Novos cômodos e extensão de áreas existentes.', active: true, icon: 'Ruler', order: 3, updatedAt: null as never },
  { id: 'banheiro-cozinha', name: 'Banheiro/cozinha', description: 'Hidráulica, impermeabilização, acabamento e funcionalidade.', active: true, icon: 'Building2', order: 4, updatedAt: null as never },
  { id: 'acabamento', name: 'Acabamento', description: 'Pisos, revestimentos, pintura, forro e ajustes finais.', active: true, icon: 'Layers', order: 5, updatedAt: null as never },
  { id: 'telhado', name: 'Telhado', description: 'Cobertura, telhas, calhas e impermeabilização.', active: true, icon: 'CloudSun', order: 6, updatedAt: null as never },
  { id: 'area-externa', name: 'Área externa', description: 'Muros, garagens, pergolados e áreas de lazer.', active: true, icon: 'Trees', order: 7, updatedAt: null as never },
]

export async function getServiceCatalog(): Promise<ServiceCatalog[]> {
  const snap = await getDocs(collection(db, COL))
  if (snap.empty) return DEFAULT_SERVICES
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceCatalog).sort((a, b) => a.order - b.order)
}

export function subscribeServiceCatalog(cb: (items: ServiceCatalog[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COL), (snap) => {
    if (snap.empty) { cb(DEFAULT_SERVICES); return }
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceCatalog).sort((a, b) => a.order - b.order))
  })
}

export async function toggleService(id: string, active: boolean): Promise<void> {
  await setDoc(doc(db, COL, id), { active, updatedAt: serverTimestamp() }, { merge: true })
}
