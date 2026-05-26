import { Search } from 'lucide-react'
import type { LeadStatus } from '../../types/Lead'
import { STATUS_LABELS } from '../../types/Lead'
import { serviceTypeOptions } from '../../data/services'

interface LeadFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  statusFilter: LeadStatus | 'todos'
  onStatusChange: (v: LeadStatus | 'todos') => void
  serviceFilter: string
  onServiceChange: (v: string) => void
}

const statusOptions: Array<{ value: LeadStatus | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos os status' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value: value as LeadStatus, label })),
]

export default function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  serviceFilter,
  onServiceChange,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por nome, telefone, cidade ou bairro..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as LeadStatus | 'todos')}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-neutral-950"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={serviceFilter}
        onChange={(e) => onServiceChange(e.target.value)}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-neutral-950"
      >
        <option value="todos">Todos os serviços</option>
        {serviceTypeOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
