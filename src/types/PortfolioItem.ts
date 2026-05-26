export interface PortfolioItem {
  id: string
  title: string
  category: string
  location: string
  description: string
  imageUrl: string
  status: 'concluida' | 'em_andamento'
}
