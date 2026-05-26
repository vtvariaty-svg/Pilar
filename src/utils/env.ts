export const env = {
  companyName: import.meta.env.VITE_COMPANY_NAME ?? 'Empreiteira Silva',
  serviceRegion: import.meta.env.VITE_SERVICE_REGION ?? 'Sua cidade e região',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '5500000000000',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL ?? '',
  yearsExperience: import.meta.env.VITE_YEARS_EXPERIENCE ?? '15+',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  },
}
