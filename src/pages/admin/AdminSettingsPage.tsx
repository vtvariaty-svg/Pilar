import { useEffect, useState, type FormEvent } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminRoute from '../../components/admin/AdminRoute'
import { getPlatformSettings, savePlatformSettings, DEFAULT_PLATFORM } from '../../services/platformSettingsService'
import type { PlatformSettings } from '../../types/PlatformSettings'

type FormData = Omit<PlatformSettings, 'id' | 'updatedAt'>

export default function AdminSettingsPage() {
  const [form, setForm] = useState<FormData>(DEFAULT_PLATFORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getPlatformSettings().then((s) => {
      const { id: _id, updatedAt: _ts, ...rest } = s
      setForm(rest)
      setLoading(false)
    })
  }, [])

  function patch(updates: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...updates }))
    setSaved(false)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    await savePlatformSettings(form)
    setSaving(false)
    setSaved(true)
  }

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          </div>
        </AdminLayout>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">ConfiguraÃ§Ãµes</h1>
          <p className="mt-1 text-sm text-neutral-500">InformaÃ§Ãµes gerais da plataforma</p>
        </div>

        <form onSubmit={handleSave} className="max-w-xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex flex-col gap-4">
              <Field label="Nome da empresa" value={form.companyName} onChange={(v) => patch({ companyName: v })} />
              <Field label="RegiÃ£o de atendimento" value={form.serviceRegion} onChange={(v) => patch({ serviceRegion: v })} />
              <Field label="WhatsApp (com DDI, ex: 5519999999999)" value={form.whatsappNumber} onChange={(v) => patch({ whatsappNumber: v })} />
              <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => patch({ instagramUrl: v })} />
              <Field label="Anos de experiÃªncia" value={form.yearsExperience} onChange={(v) => patch({ yearsExperience: v })} />
              <Field label="HorÃ¡rio de atendimento" value={form.businessHours} onChange={(v) => patch({ businessHours: v })} />
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">Disclaimer de estimativa</label>
                <textarea
                  value={form.estimateDisclaimer}
                  onChange={(e) => patch({ estimateDisclaimer: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
            >
              {saving ? 'Salvando...' : 'Salvar configuraÃ§Ãµes'}
            </button>
            {saved && <p className="text-sm font-medium text-green-600">Salvo com sucesso!</p>}
          </div>
        </form>
      </AdminLayout>
    </AdminRoute>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-neutral-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
      />
    </div>
  )
}

