import { useEffect, useState } from 'react'
import { Settings, ChevronDown, ChevronUp, Save } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import TenantAdminRoute from '../../components/route/TenantAdminRoute'
import { subscribePricingSettings, savePricingSettings } from '../../services/pricingSettingsService'
import { formatCurrency } from '../../services/quoteCalculator'
import type { PricingSettings } from '../../types/PricingSettings'

export default function AdminPricingPage() {
  const [settings, setSettings] = useState<PricingSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<Record<string, PricingSettings>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribePricingSettings((data) => {
      setSettings(data)
      setLoading(false)
    })
    return unsub
  }, [])

  function getEditing(s: PricingSettings): PricingSettings {
    return editing[s.id] ?? s
  }

  function patch(id: string, updates: Partial<PricingSettings>) {
    const base = settings.find((s) => s.id === id)!
    setEditing((prev) => ({ ...prev, [id]: { ...(prev[id] ?? base), ...updates } }))
  }

  async function handleSave(id: string) {
    const s = getEditing(settings.find((x) => x.id === id)!)
    setSaving(id)
    await savePricingSettings(s)
    setEditing((prev) => { const next = { ...prev }; delete next[id]; return next })
    setSaving(null)
  }

  return (
    <TenantAdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Parâmetros de precificação</h1>
          <p className="mt-1 text-sm text-neutral-500">Configure os valores base de cada tipo de serviço</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {settings.map((s) => {
              const current = getEditing(s)
              const isExpanded = expanded === s.id
              const isDirty = !!editing[s.id]

              return (
                <div key={s.id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : s.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-neutral-400" />
                      <div>
                        <p className="font-semibold text-neutral-950">{s.serviceType}</p>
                        <p className="text-xs text-neutral-500">
                          {formatCurrency(s.basePricePerM2)}/m² · mín. {formatCurrency(s.minimumPrice)}
                        </p>
                      </div>
                      {isDirty && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Não salvo</span>}
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-neutral-100 px-5 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <NumberField
                          label="Preço base por m² (R$)"
                          value={current.basePricePerM2}
                          onChange={(v) => patch(s.id, { basePricePerM2: v })}
                        />
                        <NumberField
                          label="Preço mínimo (R$)"
                          value={current.minimumPrice}
                          onChange={(v) => patch(s.id, { minimumPrice: v })}
                        />
                        <NumberField
                          label="Incerteza (%)"
                          value={current.uncertaintyPercent}
                          onChange={(v) => patch(s.id, { uncertaintyPercent: v })}
                        />
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Multiplicadores de acabamento</p>
                        <div className="grid grid-cols-3 gap-3">
                          <NumberField label="Econômico" value={current.finishStandardMultipliers.economico} step={0.05}
                            onChange={(v) => patch(s.id, { finishStandardMultipliers: { ...current.finishStandardMultipliers, economico: v } })} />
                          <NumberField label="Intermediário" value={current.finishStandardMultipliers.intermediario} step={0.05}
                            onChange={(v) => patch(s.id, { finishStandardMultipliers: { ...current.finishStandardMultipliers, intermediario: v } })} />
                          <NumberField label="Alto padrão" value={current.finishStandardMultipliers.alto_padrao} step={0.05}
                            onChange={(v) => patch(s.id, { finishStandardMultipliers: { ...current.finishStandardMultipliers, alto_padrao: v } })} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Multiplicadores de complexidade</p>
                        <div className="grid grid-cols-3 gap-3">
                          <NumberField label="Baixa" value={current.complexityMultipliers.baixa} step={0.05}
                            onChange={(v) => patch(s.id, { complexityMultipliers: { ...current.complexityMultipliers, baixa: v } })} />
                          <NumberField label="Média" value={current.complexityMultipliers.media} step={0.05}
                            onChange={(v) => patch(s.id, { complexityMultipliers: { ...current.complexityMultipliers, media: v } })} />
                          <NumberField label="Alta" value={current.complexityMultipliers.alta} step={0.05}
                            onChange={(v) => patch(s.id, { complexityMultipliers: { ...current.complexityMultipliers, alta: v } })} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Adicionais</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <NumberField label="Demolição (R$)" value={current.additions.demolition}
                            onChange={(v) => patch(s.id, { additions: { ...current.additions, demolition: v } })} />
                          <NumberField label="Elétrica (R$)" value={current.additions.electrical}
                            onChange={(v) => patch(s.id, { additions: { ...current.additions, electrical: v } })} />
                          <NumberField label="Hidráulica (R$)" value={current.additions.plumbing}
                            onChange={(v) => patch(s.id, { additions: { ...current.additions, plumbing: v } })} />
                          <NumberField label="Pintura (R$/m²)" value={current.additions.paintingPerM2}
                            onChange={(v) => patch(s.id, { additions: { ...current.additions, paintingPerM2: v } })} />
                          <NumberField label="Piso/revestimento (R$/m²)" value={current.additions.flooringPerM2}
                            onChange={(v) => patch(s.id, { additions: { ...current.additions, flooringPerM2: v } })} />
                        </div>
                      </div>

                      <button
                        onClick={() => handleSave(s.id)}
                        disabled={saving === s.id}
                        className="mt-5 flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
                      >
                        <Save className="h-4 w-4" />
                        {saving === s.id ? 'Salvando...' : 'Salvar alterações'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </AdminLayout>
    </TenantAdminRoute>
  )
}

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-600">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-950"
      />
    </div>
  )
}
