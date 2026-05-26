import { MessageCircle, Clock } from 'lucide-react'
import type { Lead } from '../../types/Lead'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/Lead'
import Badge from '../ui/Badge'
import { formatDateShort } from '../../utils/formatDate'
import { whatsappLinkForLead } from '../../utils/whatsapp'

interface LeadCardProps {
  lead: Lead
  onClick: () => void
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-neutral-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-neutral-950">{lead.name}</p>
          <p className="mt-0.5 text-sm text-neutral-500">{lead.phone}</p>
        </div>
        <Badge className={STATUS_COLORS[lead.status]}>
          {STATUS_LABELS[lead.status]}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
        <span>{lead.serviceType}</span>
        <span>{lead.city}{lead.neighborhood ? ` · ${lead.neighborhood}` : ''}</span>
        <span>{lead.budgetRange}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <Clock className="h-3 w-3" />
          {formatDateShort(lead.createdAt)}
        </div>
        <a
          href={whatsappLinkForLead(lead.phone, lead.name)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
        >
          <MessageCircle className="h-3 w-3" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
