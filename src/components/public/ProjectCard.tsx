import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Project } from '../../data/projects'
import { typeLabels, statusLabels } from '../../data/projects'

interface ProjectCardProps {
  project: Project
  large?: boolean
}

export default function ProjectCard({ project, large = false }: ProjectCardProps) {
  return (
    <Link
      to={`/obras/${project.slug}`}
      className={`group relative flex flex-col overflow-hidden ${large ? 'min-h-[480px]' : 'min-h-[320px]'}`}
    >
      {/* Photo placeholder */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}>
        {/* TODO: Replace with real photo */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.015) 4px, rgba(255,255,255,0.015) 8px)',
          }}
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-brand-gold/0 transition-all duration-700 group-hover:bg-brand-gold/5" />

      {/* Status badge */}
      <div className="absolute top-4 left-4">
        <span
          className={`px-3 py-1 text-xs font-bold uppercase tracking-widest ${
            project.status === 'entregue'
              ? 'bg-brand-gold text-brand-dark'
              : 'bg-brand-forest text-brand-limestone border border-brand-limestone/20'
          }`}
        >
          {statusLabels[project.status]}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          {typeLabels[project.type]} · {project.neighborhood}
        </p>
        <h3 className={`mt-2 font-serif font-bold text-brand-offwhite ${large ? 'text-2xl' : 'text-lg'}`}>
          {project.title}
        </h3>
        {project.area && (
          <p className="mt-1 text-sm text-brand-limestone/70">{project.area}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-limestone opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
          Ver obra <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}
