import type { Timestamp } from 'firebase/firestore'

export interface PlatformSettings {
  id: string
  companyName: string
  serviceRegion: string
  whatsappNumber: string
  instagramUrl: string
  yearsExperience: string
  estimateDisclaimer: string
  businessHours: string
  updatedAt: Timestamp
}
