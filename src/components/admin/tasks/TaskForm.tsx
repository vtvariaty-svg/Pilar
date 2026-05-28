import { useState } from 'react'
import type { TaskPriority, TaskStatus, TaskType } from '../../../types/Task'
import { TASK_TYPE_LABELS, TASK_PRIORITY_LABELS } from '../../../types/Task'
import Button from '../../ui/Button'

export interface TaskFormValues {
  type: TaskType
  title: string
  description?: string
  priority: TaskPriority
  dueAt?: string
  assignedTo?: string
  status: TaskStatus
}

interface TaskFormProps {
  initial?: Partial<TaskFormValues>
  leadId?: string
  onSubmit: (data: TaskFormValues) => Promise<void>
  onCancel: () => void
}

export default function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormValues>({
    type: initial?.type ?? 'manual',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    priority: initial?.priority ?? 'medium',
    dueAt: initial?.dueAt ?? '',
    assignedTo: initial?.assignedTo ?? '',
    status: initial?.status ?? 'open',
  })
  const [loading, setLoading] = useState(false)

  function patch<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Tipo
          </label>
          <select
            value={form.type}
            onChange={(e) => patch('type', e.target.value as TaskType)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          >
            {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((t) => (
              <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Prioridade
          </label>
          <select
            value={form.priority}
            onChange={(e) => patch('priority', e.target.value as TaskPriority)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          >
            {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((p) => (
              <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Título *
        </label>
        <input
          value={form.title}
          onChange={(e) => patch('title', e.target.value)}
          required
          placeholder="Descreva a tarefa..."
          className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Descrição
        </label>
        <textarea
          value={form.description}
          onChange={(e) => patch('description', e.target.value)}
          rows={2}
          placeholder="Detalhes adicionais..."
          className="w-full resize-none rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Prazo
          </label>
          <input
            type="datetime-local"
            value={form.dueAt}
            onChange={(e) => patch('dueAt', e.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => patch('status', e.target.value as TaskStatus)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
          >
            <option value="open">Aberta</option>
            <option value="in_progress">Em andamento</option>
            <option value="done">Concluída</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} size="sm">
          Salvar tarefa
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
