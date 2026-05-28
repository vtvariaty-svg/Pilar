export interface PublicService {
  slug: string
  title: string
  shortDesc: string
  description: string
  whenToHire: string
  scope: string[]
  differentials: string[]
  steps: string[]
  faq: { q: string; a: string }[]
  gradient: string
}

export const publicServices: PublicService[] = [
  {
    slug: 'construcao-residencial',
    title: 'Construção Residencial',
    shortDesc: 'Do projeto ao acabamento, conduzimos sua obra do zero com método, transparência e responsabilidade técnica.',
    description: 'Construímos residências do zero — casas, sobrados e unidades independentes — com planejamento rigoroso, equipe própria e supervisão em todas as etapas. Do movimento de terra à entrega das chaves, cada fase é documentada e comunicada ao cliente.',
    whenToHire: 'Quando você tem terreno e projeto aprovado, ou está iniciando o processo de construção da primeira residência ou de uma segunda unidade no mesmo lote.',
    scope: [
      'Fundação e estrutura em concreto armado',
      'Alvenaria, lajes e coberturas',
      'Instalações elétricas e hidrossanitárias',
      'Revestimentos internos e externos',
      'Esquadrias, portas e janelas',
      'Acabamento fino: gesso, pintura, piso',
      'Área externa e paisagismo básico',
    ],
    differentials: [
      'Cronograma detalhado com atualizações semanais',
      'Proposta formal com memória de cálculo',
      'Equipe fixada na obra do início ao fim',
      'Acompanhamento via área do cliente',
      'Visita técnica antes da proposta',
    ],
    steps: [
      'Análise do terreno e projeto',
      'Estimativa e visita técnica',
      'Proposta formal e cronograma',
      'Início da execução',
      'Relatórios de avanço',
      'Acabamento e entrega',
    ],
    faq: [
      { q: 'Quanto tempo leva uma construção do zero?', a: 'Uma casa de até 150m² leva em média 8 a 12 meses, dependendo do nível de acabamento e complexidade estrutural.' },
      { q: 'Vocês fornecem os materiais?', a: 'Sim. Trabalhamos com fornecimento integral ou parcial de materiais, conforme preferência do cliente.' },
      { q: 'É necessário ter projeto antes de contratar?', a: 'Recomendamos ter pelo menos o projeto arquitetônico aprovado. Podemos indicar profissionais parceiros se necessário.' },
    ],
    gradient: 'from-[#0f1a14] via-[#1a2820] to-[#0B0B0A]',
  },
  {
    slug: 'reforma-completa',
    title: 'Reforma Completa',
    shortDesc: 'Reformamos residências completas com gestão de obra, equipe própria e comunicação clara em cada etapa.',
    description: 'Reformas residenciais completas envolvem demolições, adequações estruturais, novas instalações e acabamento total. Executamos do escoramento à última demão de tinta, com equipe experiente e controle de prazos rigoroso.',
    whenToHire: 'Quando o imóvel precisa de renovação completa — seja por desgaste, compra de imóvel antigo, mudança de layout ou upgrade de padrão.',
    scope: [
      'Demolições e adequações estruturais',
      'Impermeabilização de lajes e banheiros',
      'Troca de instalações elétricas e hidráulicas',
      'Revestimentos cerâmicos e porcelanatos',
      'Gesso, pintura e acabamentos internos',
      'Esquadrias e marcenaria básica',
      'Limpeza técnica e entrega',
    ],
    differentials: [
      'Visita técnica com diagnóstico antes da proposta',
      'Orçamento discriminado por etapa',
      'Gestão de fornecedores e materiais',
      'Proteção de áreas não afetadas',
      'Relatório fotográfico semanal',
    ],
    steps: [
      'Visita e diagnóstico',
      'Projeto e proposta',
      'Planejamento de etapas',
      'Execução com proteção',
      'Acabamento fino',
      'Entrega e vistoria',
    ],
    faq: [
      { q: 'Preciso sair do imóvel durante a reforma?', a: 'Depende da extensão. Em reformas parciais é possível permanecer. Em reformas completas recomendamos desocupar para segurança e agilidade.' },
      { q: 'Vocês fazem projeto antes da obra?', a: 'Trabalhamos com projeto executivo básico incluído na proposta, ou integramos com o arquiteto do cliente.' },
      { q: 'Como é feito o acompanhamento da obra?', a: 'O cliente tem acesso à área do cliente com status, fotos e timeline de cada etapa.' },
    ],
    gradient: 'from-[#1a1a19] via-[#232323] to-[#111110]',
  },
  {
    slug: 'acabamento-fino',
    title: 'Acabamento Fino',
    shortDesc: 'Aplicação de revestimentos premium, gesso, pintura técnica e acabamentos de alto padrão.',
    description: 'O acabamento define o padrão de uma obra. Executamos aplicação de porcelanatos grandes, gesso liso, pintura técnica, rodapés, frisos e detalhes que elevam o resultado estético e o valor percebido do imóvel.',
    whenToHire: 'Quando a estrutura já está pronta e o foco é o acabamento — ou quando o imóvel existente precisa de upgrade visual sem reforma estrutural.',
    scope: [
      'Aplicação de porcelanato e revestimentos especiais',
      'Gesso liso e sancas',
      'Pintura técnica interna e externa',
      'Rodapés e frisos em MDF ou mármore',
      'Detalhes em drywall',
      'Pastilhas e mosaicos',
    ],
    differentials: [
      'Equipe especializada em acabamento fino',
      'Seleção e indicação de materiais',
      'Padrão de entrega compatível com alto padrão',
      'Atenção ao alinhamento, nível e rejuntamento',
    ],
    steps: [
      'Análise da base e preparação',
      'Assentamento e revestimento',
      'Gesso e texturas',
      'Pintura e detalhamento',
      'Vistoria e entrega',
    ],
    faq: [
      { q: 'Vocês indicam materiais?', a: 'Sim. Trabalhamos com fornecedores parceiros e podemos orientar na seleção de revestimentos adequados ao padrão desejado.' },
      { q: 'Qual o prazo médio para acabamento de uma casa?', a: 'Uma casa de 120m² com acabamento completo leva em média 30 a 60 dias, dependendo do nível de complexidade.' },
    ],
    gradient: 'from-[#1a1510] via-[#2a2015] to-[#0B0B0A]',
  },
  {
    slug: 'banheiros-e-cozinhas',
    title: 'Banheiros e Cozinhas',
    shortDesc: 'Reforma especializada nos ambientes de maior complexidade técnica e impacto no valor do imóvel.',
    description: 'Banheiros e cozinhas concentram a maior parte das instalações hidráulicas e elétricas de um imóvel. Nossa equipe atua com planejamento minucioso para entregar ambientes funcionais, bonitos e duradouros.',
    whenToHire: 'Quando o banheiro ou a cozinha está com instalações antigas, revestimento degradado ou precisa de um upgrade de padrão.',
    scope: [
      'Demolição e remoção de revestimentos',
      'Impermeabilização profissional',
      'Troca de instalações hidráulicas e elétricas',
      'Assentamento de porcelanato e revestimentos',
      'Bancadas em mármore, granito ou porcelanato',
      'Instalação de louças, metais e armários',
      'Box, espelhos e acessórios',
    ],
    differentials: [
      'Equipe especializada em ambientes molhados',
      'Impermeabilização com garantia',
      'Integração com marcenaria e metais',
      'Orientação na escolha de materiais',
    ],
    steps: [
      'Diagnóstico e projeto básico',
      'Demolição controlada',
      'Impermeabilização',
      'Instalações e revestimento',
      'Instalação de louças e metais',
      'Entrega e teste',
    ],
    faq: [
      { q: 'Quanto tempo leva a reforma de um banheiro?', a: 'Um banheiro padrão leva de 15 a 25 dias úteis. Banheiros com alto padrão podem levar mais.' },
      { q: 'Vocês instalam a marcenaria?', a: 'Fazemos a preparação e instalamos armários e bancadas. A fabricação pode ser por fornecedor parceiro.' },
    ],
    gradient: 'from-[#0f1520] via-[#1a2030] to-[#0B0B0A]',
  },
  {
    slug: 'telhados-e-areas-externas',
    title: 'Telhados e Áreas Externas',
    shortDesc: 'Telhados, coberturas, áreas de lazer e espaços externos com técnica e acabamento de qualidade.',
    description: 'Atuamos em coberturas residenciais completas — troca de telhas, estrutura de madeira ou metálica, calhas e impermeabilização — além de áreas externas, pergolados, churrasqueiras e pisos externos.',
    whenToHire: 'Quando há infiltrações, telhado velho, ou quando o objetivo é criar ou renovar a área externa da residência.',
    scope: [
      'Troca completa de cobertura',
      'Estrutura de madeira ou metálica',
      'Calhas e rufos',
      'Impermeabilização de lajes',
      'Área de lazer e churrasqueira',
      'Piso externo e intertravado',
      'Pergolados e coberturas de vidro',
    ],
    differentials: [
      'Diagnóstico de infiltração antes da proposta',
      'Garantia na impermeabilização',
      'Execução com segurança e andaimes',
      'Integração com acabamento externo',
    ],
    steps: [
      'Diagnóstico de cobertura',
      'Projeto e proposta',
      'Retirada e preparação',
      'Estrutura e telhas',
      'Calhas e arremates',
      'Entrega e teste de estanqueidade',
    ],
    faq: [
      { q: 'Como identificar se preciso trocar o telhado?', a: 'Infiltrações persistentes, telhas quebradas ou estrutura com sinais de apodrecimento indicam necessidade de revisão completa.' },
      { q: 'Vocês fazem cobertura de área de lazer?', a: 'Sim. Pergolados, telhas de vidro, policarbonato e telhas cerâmicas fazem parte do nosso escopo.' },
    ],
    gradient: 'from-[#111820] via-[#1a2535] to-[#0B0B0A]',
  },
  {
    slug: 'ampliacoes',
    title: 'Ampliações',
    shortDesc: 'Expansão de áreas internas com estrutura adequada, integração arquitetônica e acabamento contínuo.',
    description: 'Ampliações exigem análise estrutural cuidadosa para garantir a integridade do imóvel existente. Executamos dormitórios, suítes, garagens, áreas de lazer e expansões de sala com planejamento que respeita a estrutura original.',
    whenToHire: 'Quando a família cresce, o imóvel não comporta mais as necessidades, ou quando há terreno disponível para expansão horizontal ou vertical.',
    scope: [
      'Análise estrutural do imóvel existente',
      'Fundação complementar se necessário',
      'Alvenaria e lajes de ampliação',
      'Integração elétrica e hidráulica',
      'Revestimento com continuidade visual',
      'Acabamento integrado ao existente',
    ],
    differentials: [
      'Cuidado com a estrutura existente',
      'Integração visual com o imóvel original',
      'Minimização de impacto durante a obra',
      'Documentação completa de avanço',
    ],
    steps: [
      'Visita e análise estrutural',
      'Projeto e proposta',
      'Fundação e estrutura',
      'Alvenaria e cobertura',
      'Instalações e acabamento',
      'Entrega e integração',
    ],
    faq: [
      { q: 'É necessário aprovação na prefeitura?', a: 'Dependendo do município e da extensão da ampliação, pode ser necessário aprovação. Orientamos sobre a regularização.' },
      { q: 'A ampliação afeta a estrutura original da casa?', a: 'Nossa equipe analisa a estrutura antes de qualquer intervenção para garantir a segurança de toda a edificação.' },
    ],
    gradient: 'from-[#14180f] via-[#1e2415] to-[#0B0B0A]',
  },
]
