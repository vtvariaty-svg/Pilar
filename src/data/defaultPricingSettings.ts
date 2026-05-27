import type { PricingSettings } from '../types/PricingSettings'
import type { Timestamp } from 'firebase/firestore'

const base: Omit<PricingSettings, 'id' | 'serviceType' | 'basePricePerM2' | 'minimumPrice' | 'updatedAt'> = {
  active: true,
  unit: 'm2',
  uncertaintyPercent: 25,
  finishStandardMultipliers: { economico: 0.8, intermediario: 1.0, alto_padrao: 1.45 },
  complexityMultipliers: { baixa: 0.9, media: 1.0, alta: 1.3 },
  urgencyMultipliers: { normal: 1.0, urgente: 1.2 },
  additions: { demolition: 3500, electrical: 4500, plumbing: 4000, paintingPerM2: 45, flooringPerM2: 120 },
  updatedBy: 'system',
}

const fakeTs = { toDate: () => new Date(), seconds: 0, nanoseconds: 0 } as unknown as Timestamp

export const DEFAULT_PRICING: PricingSettings[] = [
  { ...base, id: 'construcao-zero', serviceType: 'Construção do zero', basePricePerM2: 2800, minimumPrice: 80000, updatedAt: fakeTs },
  { ...base, id: 'reforma-completa', serviceType: 'Reforma completa', basePricePerM2: 900, minimumPrice: 15000, updatedAt: fakeTs },
  { ...base, id: 'ampliacao', serviceType: 'Ampliação', basePricePerM2: 2200, minimumPrice: 25000, updatedAt: fakeTs },
  { ...base, id: 'banheiro-cozinha', serviceType: 'Banheiro/cozinha', basePricePerM2: 1600, minimumPrice: 8000, updatedAt: fakeTs },
  { ...base, id: 'acabamento', serviceType: 'Acabamento', basePricePerM2: 350, minimumPrice: 5000, updatedAt: fakeTs },
  { ...base, id: 'telhado', serviceType: 'Telhado', basePricePerM2: 220, minimumPrice: 4000, updatedAt: fakeTs },
  { ...base, id: 'area-externa', serviceType: 'Área externa', basePricePerM2: 380, minimumPrice: 6000, updatedAt: fakeTs },
  { ...base, id: 'outro', serviceType: 'Outro', basePricePerM2: 800, minimumPrice: 5000, updatedAt: fakeTs },
]
