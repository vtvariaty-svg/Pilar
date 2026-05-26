import { useState } from 'react'
import { X, MessageCircle, Save } from 'lucide-react'
import type { Lead, LeadStatus } from '../../types/Lead'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/Lead'
import { updateLeadStatus, updateLeadNotes } from '../../services/leadsService'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate } from '../../utils/formatDate'
import { whatsappLinkForLead } from '../../utils/whatsapp'

interface LeadDetailsProps {
  lead: Lead
  onClose: () => void
  onUpdated: () => void
}

export default function LeadDetails({ lead, onClose, onUpdated }: LeadDetailsProps) {
  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const [notes, setNotes] = useState(lead.internalNotes ?? '')
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  async function handleStatusChange(newStatus: LeadStatus) {
    setStatus(newStatus)
    setSavingStatus(true)
    try {
      await updateLeadStatus(lead.id, newStatus)
      onUpdated()
    } finally {
      setSavingStatus(false)
    }
  }

  async function handleSaveNotes() {
    setSavingNotes(true)
    try {
      await updateLeadNotes(lead.id, notes)
      onUpdated()
    } finally {
      setSavingNotes(false)
    }
  }

  const fields: Array<{ label: string; value: string }> = [
    { label: 'Nome', value: lead.name },
    { label: 'Telefone', value: lead.phone },
    { label: 'Cidade', value: lead.city },
    { label: 'Bairro', value: lead.neighborhood || '—' },
    { label: 'Tipo de serviço', value: lead.serviceType },
    { label: 'Faixa de orçamento', value: lead.budgetRange },
    { label: 'Prazo desejado', value: lead.desiredTimeline },
    { label: 'Descrição', value: lead.description },
    { label: 'Observações do cliente', value: lead.notes || '—' },
    { label: 'Origem', value: lead.source },
    { label: 'Criado em', value: formatDate(lead.createdAt) },
    { label: 'Atualizado em', value: formatDate(lead.updatedAt) },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
          <div>
            <h2 className="font-bold text-neutral-950">{lead.name}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{lead.phone} · {lead.city}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={whatsappLinkForLead(lead.phone, lead.name)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <button onClick={onClose} className="rounded-xl p-1.5 text-neutral-500 hover:bg-neutral-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-5">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={savingStatus}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    status === s
                      ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-neutral-950'
                      : STATUS_COLORS[s] + ' opacity-60 hover:opacity-100'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1">
              Status atual: <Badge className={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Badge>
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Dados do pedido</h3>
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 divide-y divide-neutral-100">
              {fields.map(({ label, value }) => (
                <div key={label} className="flex gap-4 px-4 py-3">
                  <p className="w-40 shrink-0 text-xs font-medium text-neutral-500">{label}</p>
                  <p className="text-sm text-neutral-900 break-words">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Observações internas</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Notas internas sobre este lead (não visíveis ao cliente)..."
              className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-950"
            />
            <Button
              onClick={handleSaveNotes}
              loading={savingNotes}
              size="sm"
              className="mt-2"
            >
              <Save className="h-3.5 w-3.5" />
              Salvar observação
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
