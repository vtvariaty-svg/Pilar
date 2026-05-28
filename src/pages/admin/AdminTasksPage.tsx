import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, ExternalLink, Plus, CheckCircle2 } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import TaskForm from '../../components/admin/tasks/TaskForm'
import { subscribeTasks, completeTask, createTask } from '../../services/taskService'
import { createTimelineEvent } from '../../services/commercialFlowService'
import { formatDate } from '../../utils/formatDate'
import {
  TASK_TYPE_LABELS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_COLORS,
  type Task,
  type TaskStatus,
  type TaskPriority,
  type TaskType,
} from '../../types/Task'
import { useAuth } from '../../contexts/AuthContext'
import { Timestamp } from 'firebase/firestore'

const TENANT = 'pilar'

function isOverdue(task: Task) {
  if (!task.dueAt || task.status === 'done' || task.status === 'cancelled') return false
  return task.dueAt.toDate() < new Date()
}

function isToday(task: Task) {
  if (!task.dueAt) return false
  const due = task.dueAt.toDate()
  const now = new Date()
  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  )
}

export default function AdminTasksPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all')
  const [viewMode, setViewMode] = useState<'all' | 'overdue' | 'today' | 'open'>('open')
  const [showForm, setShowForm] = useState(false)
  const [completing, setCompleting] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeTasks(TENANT, (data) => {
      setTasks(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = useMemo(() => {
    let list = tasks
    if (viewMode === 'overdue') list = list.filter(isOverdue)
    else if (viewMode === 'today') list = list.filter(isToday)
    else if (viewMode === 'open') list = list.filter((t) => t.status === 'open' || t.status === 'in_progress')
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter)
    if (priorityFilter !== 'all') list = list.filter((t) => t.priority === priorityFilter)
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter)
    return list
  }, [tasks, viewMode, statusFilter, priorityFilter, typeFilter])

  const overdueCount = tasks.filter(isOverdue).length
  const todayCount = tasks.filter(isToday).length
  const openCount = tasks.filter((t) => t.status === 'open' || t.status === 'in_progress').length

  async function handleComplete(task: Task) {
    setCompleting(task.id)
    try {
      await completeTask(TENANT, task.id)
      if (task.leadId) {
        await createTimelineEvent(TENANT, task.leadId, {
          type: 'note_added',
          title: 'Tarefa concluída',
          description: task.title,
          visibility: 'internal',
          createdBy: user?.uid,
        })
      }
    } finally {
      setCompleting(null)
    }
  }

  async function handleCreateTask(data: Parameters<typeof createTask>[1]) {
    await createTask(TENANT, data, user?.uid)
    setShowForm(false)
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-neutral-950">Tarefas</h1>
            <p className="mt-1 text-sm text-neutral-500">{openCount} abertas · {overdueCount} atrasadas · {todayCount} para hoje</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Nova tarefa
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neutral-950">Nova tarefa</h2>
            <TaskForm
              onSubmit={async (data) => {
                const dueAt = data.dueAt
                  ? Timestamp.fromDate(new Date(data.dueAt))
                  : undefined
                await handleCreateTask({
                  type: data.type,
                  title: data.title,
                  description: data.description,
                  priority: data.priority,
                  status: data.status,
                  ...(dueAt ? { dueAt } : {}),
                })
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* View mode tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {([
            { key: 'open', label: `Abertas (${openCount})` },
            { key: 'overdue', label: `Atrasadas (${overdueCount})` },
            { key: 'today', label: `Hoje (${todayCount})` },
            { key: 'all', label: 'Todas' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
                viewMode === key
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-950"
          >
            <option value="all">Todas prioridades</option>
            {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((p) => (
              <option key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TaskType | 'all')}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-950"
          >
            <option value="all">Todos os tipos</option>
            {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((t) => (
              <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-950"
          >
            <option value="all">Todos os status</option>
            {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white py-16 text-center">
            <CheckSquare className="h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-500">Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((task) => {
              const overdue = isOverdue(task)
              return (
                <div
                  key={task.id}
                  className={`rounded-2xl border bg-white p-4 ${overdue ? 'border-red-200' : 'border-neutral-200'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                          {TASK_PRIORITY_LABELS[task.priority]}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                          {TASK_TYPE_LABELS[task.type]}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                          {TASK_STATUS_LABELS[task.status]}
                        </span>
                      </div>
                      <p className="mt-1.5 font-semibold text-neutral-950">{task.title}</p>
                      {task.description && (
                        <p className="mt-0.5 text-sm text-neutral-500">{task.description}</p>
                      )}
                      {task.dueAt && (
                        <p className={`mt-1 text-xs ${overdue ? 'font-semibold text-red-600' : 'text-neutral-400'}`}>
                          {overdue ? 'Atrasada · ' : 'Prazo: '}
                          {formatDate(task.dueAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {task.leadId && (
                        <button
                          onClick={() => navigate(`/admin/pedidos/${task.leadId}`)}
                          className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Pedido
                        </button>
                      )}
                      {(task.status === 'open' || task.status === 'in_progress') && (
                        <button
                          onClick={() => handleComplete(task)}
                          disabled={completing === task.id}
                          className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Concluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  )
}
