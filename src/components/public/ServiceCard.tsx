import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { PublicService } from '../../data/publicServices'

interface ServiceCardProps {
  service: PublicService
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      to={`/servicos/${service.slug}`}
      className="group relative flex flex-col overflow-hidden"
    >
      {/* Photo placeholder */}
      <div className={`relative h-64 bg-gradient-to-br ${service.gradient} overflow-hidden`}>
        {/* TODO: Replace with real photo */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 6px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="border border-brand-gold/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-gold">
            {service.title}
          </span>
        </div>
        <div className="absolute inset-0 bg-brand-gold/0 transition-all duration-500 group-hover:bg-brand-gold/5" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col border border-t-0 border-[#2a2a28] bg-brand-concrete p-6">
        <p className="text-sm leading-6 text-brand-limestone/80">{service.shortDesc}</p>
        <ul className="mt-4 space-y-1.5">
          {service.scope.slice(0, 3).map((s) => (
            <li key={s} className="flex items-start gap-2 text-xs text-brand-limestone/60">
              <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-brand-gold" />
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-gold transition group-hover:gap-3">
          Ver detalhes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
