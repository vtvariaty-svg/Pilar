import { Home, Wrench, Ruler, Building2, Layers, CloudSun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Service {
  icon: LucideIcon
  title: string
  text: string
}

export const services: Service[] = [
  {
    icon: Home,
    title: 'Construção do zero',
    text: 'Execução de casas, sobrados e imóveis comerciais com planejamento por etapas, do alicerce ao acabamento.',
  },
  {
    icon: Wrench,
    title: 'Reformas completas',
    text: 'Reforma geral de casas, apartamentos, áreas comerciais e imóveis para venda ou locação.',
  },
  {
    icon: Ruler,
    title: 'Ampliações',
    text: 'Construção de novos cômodos, extensão de áreas e aproveitamento de espaços existentes.',
  },
  {
    icon: Building2,
    title: 'Banheiros e cozinhas',
    text: 'Ambientes que exigem cuidado com hidráulica, impermeabilização, acabamento e funcionalidade.',
  },
  {
    icon: Layers,
    title: 'Acabamentos',
    text: 'Troca de pisos, revestimentos, pintura, forro, gesso e ajustes finais para valorizar o imóvel.',
  },
  {
    icon: CloudSun,
    title: 'Telhados e áreas externas',
    text: 'Cobertura, telhas, calhas, muros, garagens, pergolados e áreas de lazer.',
  },
]

export const serviceTypeOptions = [
  'Construção do zero',
  'Reforma completa',
  'Ampliação',
  'Banheiro/cozinha',
  'Acabamento',
  'Telhado',
  'Outro',
] as const

export type ServiceType = typeof serviceTypeOptions[number]
