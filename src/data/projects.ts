export type ProjectType = 'reforma' | 'construcao' | 'acabamento' | 'ampliacao'
export type ProjectStatus = 'entregue' | 'em-andamento'

export interface Project {
  slug: string
  title: string
  type: ProjectType
  status: ProjectStatus
  city: string
  neighborhood: string
  scope: string
  area?: string
  duration?: string
  description: string
  highlights: string[]
  gradient: string
  gradientAlt: string
}

export const projects: Project[] = [
  {
    slug: 'reforma-apartamento-centro',
    title: 'Reforma completa de apartamento',
    type: 'reforma',
    status: 'entregue',
    city: 'Pilar do Sul',
    neighborhood: 'Centro',
    scope: 'Reforma completa',
    area: '85m²',
    duration: '45 dias',
    description: 'Reforma total de apartamento com troca de piso, renovação de instalações elétricas e hidráulicas, novo banheiro e cozinha reformulada. Acabamento com porcelanato 90x90 e pintura premium.',
    highlights: ['Porcelanato 90x90 em todos os ambientes', 'Banheiro com box de vidro temperado', 'Cozinha integrada à sala', 'Elétrica com disjuntores novos e tomadas USB'],
    gradient: 'from-[#1a1a19] via-[#252523] to-[#111110]',
    gradientAlt: 'from-[#2a2820] via-[#1e1c18] to-[#111110]',
  },
  {
    slug: 'construcao-residencial-jardim',
    title: 'Casa residencial — construção do zero',
    type: 'construcao',
    status: 'entregue',
    city: 'Pilar do Sul',
    neighborhood: 'Jardim das Flores',
    scope: 'Construção residencial',
    area: '120m²',
    duration: '9 meses',
    description: 'Casa térrea de 120m² construída do zero sobre lote plano. Três quartos, dois banheiros, sala integrada e área de serviço. Acabamento padrão médio-alto com revestimentos selecionados.',
    highlights: ['Fundação em radier reforçado', 'Estrutura em concreto armado', 'Cobertura com telha colonial', 'Acabamento completo incluso'],
    gradient: 'from-[#0f1a14] via-[#162110] to-[#0B0B0A]',
    gradientAlt: 'from-[#1a2818] via-[#101a0d] to-[#0B0B0A]',
  },
  {
    slug: 'reforma-banheiro-suíte',
    title: 'Reforma de suíte e banheiro principal',
    type: 'reforma',
    status: 'entregue',
    city: 'Pilar do Sul',
    neighborhood: 'Vila Nova',
    scope: 'Banheiros e cozinhas',
    area: '18m²',
    duration: '22 dias',
    description: 'Reforma completa de suíte e banheiro com impermeabilização profissional, porcelanato de alto padrão, bancada em mármore travertino e box em vidro jateado.',
    highlights: ['Impermeabilização com garantia 5 anos', 'Bancada em mármore travertino', 'Ducha com misturador termostático', 'Espelho com iluminação embutida'],
    gradient: 'from-[#111520] via-[#1a2030] to-[#0B0B0A]',
    gradientAlt: 'from-[#0f1525] via-[#141d30] to-[#0B0B0A]',
  },
  {
    slug: 'area-lazer-churrasqueira',
    title: 'Área de lazer com churrasqueira',
    type: 'acabamento',
    status: 'entregue',
    city: 'Pilar do Sul',
    neighborhood: 'Bairro Alto',
    scope: 'Telhados e áreas externas',
    area: '40m²',
    duration: '30 dias',
    description: 'Construção de área de lazer com churrasqueira em alvenaria, cobertura com estrutura de madeira e telha cerâmica, piso em pedra São Tomé e pergolado lateral.',
    highlights: ['Churrasqueira com forno e balcão', 'Pergolado com iluminação', 'Piso em pedra São Tomé', 'Cobertura com calha dupla'],
    gradient: 'from-[#1a1510] via-[#251c12] to-[#0B0B0A]',
    gradientAlt: 'from-[#2a1e10] via-[#1a1208] to-[#0B0B0A]',
  },
  {
    slug: 'ampliacao-suite-closet',
    title: 'Ampliação — suíte com closet',
    type: 'ampliacao',
    status: 'em-andamento',
    city: 'Pilar do Sul',
    neighborhood: 'Santa Cruz',
    scope: 'Ampliação',
    area: '25m²',
    duration: '35 dias',
    description: 'Ampliação de quarto existente com criação de closet e banheiro privativo. Integração com acabamento da residência original. Fundação complementar em sapata corrida.',
    highlights: ['Integração com estrutura existente', 'Closet planejado embutido', 'Banheiro com chuveiro a chuva', 'Acabamento contínuo com a casa'],
    gradient: 'from-[#14180f] via-[#1c2214] to-[#0B0B0A]',
    gradientAlt: 'from-[#1a2215] via-[#131a0e] to-[#0B0B0A]',
  },
  {
    slug: 'reforma-telhado-impermeabilizacao',
    title: 'Troca de telhado e impermeabilização',
    type: 'reforma',
    status: 'entregue',
    city: 'Pilar do Sul',
    neighborhood: 'Jardim América',
    scope: 'Telhados e áreas externas',
    area: '180m² de cobertura',
    duration: '18 dias',
    description: 'Troca completa de telhado em casa térrea com remoção de cobertura antiga, nova estrutura em madeira tratada, telha cerâmica e impermeabilização de laje de cobertura.',
    highlights: ['Estrutura em madeira tratada', 'Telha cerâmica linha premium', 'Impermeabilização com manta asfáltica', 'Calhas e rufos novos em todo perímetro'],
    gradient: 'from-[#111820] via-[#192535] to-[#0B0B0A]',
    gradientAlt: 'from-[#0f1a28] via-[#152032] to-[#0B0B0A]',
  },
]

export const typeLabels: Record<ProjectType, string> = {
  reforma: 'Reforma',
  construcao: 'Construção',
  acabamento: 'Acabamento',
  ampliacao: 'Ampliação',
}

export const statusLabels: Record<ProjectStatus, string> = {
  entregue: 'Entregue',
  'em-andamento': 'Em andamento',
}
