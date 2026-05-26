import { CheckCircle2, Image as ImageIcon, ArrowRight, MessageCircle } from 'lucide-react'
import { portfolioItems } from '../../data/portfolio'
import { whatsappLink } from '../../utils/whatsapp'
import Badge from '../ui/Badge'

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              Portfólio
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Obras reais geram confiança antes da primeira conversa
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              Trabalhos executados com qualidade e atenção aos detalhes. Cada projeto entregue com o padrão que nossos clientes merecem.
            </p>
          </div>

          <a
            href={whatsappLink('Olá, vi o portfólio e gostaria de conversar sobre minha obra.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800"
          >
            <MessageCircle className="h-4 w-4" />
            Conversar sobre minha obra
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 shadow-sm">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-neutral-100 text-neutral-400">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
              <div className="border-t border-neutral-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold leading-snug">{item.title}</p>
                  <Badge
                    className={item.status === 'concluida' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {item.status === 'concluida' ? 'Concluída' : 'Em andamento'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{item.category} · {item.location}</p>
                <p className="mt-2 text-xs leading-5 text-neutral-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
