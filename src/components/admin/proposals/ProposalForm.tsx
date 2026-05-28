import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Button from '../../ui/Button'
import type { ProposalItem } from '../../../types/Proposal'
import type { ProposalFormData } from '../../../services/proposalService'

interface ProposalFormProps {
  leadId: string
  customerUid?: string
  quoteEstimateId?: string
  onSubmit: (data: ProposalFormData) => Promise<void>
  onCancel: () => void
}

function newItem(): ProposalItem {
  return { id: crypto.randomUUID(), description: '', quantity: 1, unit: 'un', unitPrice: 0, total: 0 }
}

function calcSubtotal(items: ProposalItem[]): number {
  return items.reduce((s, i) => s + i.total, 0)
}

export default function ProposalForm({
  leadId,
  customerUid,
  quoteEstimateId,
  onSubmit,
  onCancel,
}: ProposalFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<ProposalItem[]>([newItem()])
  const [discount, setDiscount] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [executionDeadline, setExecutionDeadline] = useState('')
  const [warrantyInfo, setWarrantyInfo] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  function updateItem(idx: number, patch: Partial<ProposalItem>) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item
        const updated = { ...item, ...patch }
        updated.total = updated.quantity * updated.unitPrice
        return updated
      }),
    )
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const subtotal = calcSubtotal(items)
  const discountVal = parseFloat(discount) || 0
  const total = Math.max(0, subtotal - discountVal)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({
        leadId,
        customerUid,
        quoteEstimateId,
        title,
        description,
        items,
        subtotal,
        discount: discountVal || undefined,
        total,
        paymentTerms: paymentTerms || undefined,
        executionDeadline: executionDeadline || undefined,
        warrantyInfo: warrantyInfo || undefined,
        notes: notes || undefined,
        validUntil: validUntil || undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-950'
  const labelCls = 'mb-1 block text-xs font-medium text-neutral-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Título *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Proposta de reforma completa" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Descrição</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Resumo do escopo" className={`${inputCls} resize-none`} />
        </div>
      </div>

      {/* Itens */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className={labelCls}>Itens da proposta</label>
          <button type="button" onClick={() => setItems((p) => [...p, newItem()])} className="flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-950">
            <Plus className="h-3.5 w-3.5" /> Adicionar item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <div className="col-span-12 sm:col-span-5">
                <label className={labelCls}>Descrição</label>
                <input required value={item.description} onChange={(e) => updateItem(idx, { description: e.target.value })} placeholder="Serviço ou material" className={inputCls} />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label className={labelCls}>Qtd</label>
                <input type="number" min="0" step="0.01" value={item.quantity} onChange={(e) => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })} className={inputCls} />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className={labelCls}>Unidade</label>
                <input value={item.unit} onChange={(e) => updateItem(idx, { unit: e.target.value })} placeholder="un / m² / hr" className={inputCls} />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className={labelCls}>Valor unit.</label>
                <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })} className={inputCls} />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className={labelCls}>Total</label>
                <div className="flex h-9 items-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700">
                  {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-end justify-center pb-0.5">
                <button type="button" onClick={() => removeItem(idx)} disabled={items.length === 1} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totais */}
      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Subtotal</span>
          <span className="font-semibold">{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-sm">
          <span className="text-neutral-500">Desconto (R$)</span>
          <input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0,00" className="w-36 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-right outline-none focus:border-neutral-950" />
        </div>
        <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-base font-bold">
          <span>Total</span>
          <span className="text-neutral-950">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      </div>

      {/* Condições comerciais */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Prazo de execução</label>
          <input value={executionDeadline} onChange={(e) => setExecutionDeadline(e.target.value)} placeholder="Ex: 45 dias corridos" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Validade da proposta</label>
          <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Condições de pagamento</label>
          <input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Ex: 30% de entrada, 40% na metade da obra, 30% na entrega" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Garantia</label>
          <input value={warrantyInfo} onChange={(e) => setWarrantyInfo(e.target.value)} placeholder="Ex: 12 meses para serviços estruturais" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Observações</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Informações adicionais..." className={`${inputCls} resize-none`} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={saving}>Salvar proposta</Button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </button>
      </div>
    </form>
  )
}
