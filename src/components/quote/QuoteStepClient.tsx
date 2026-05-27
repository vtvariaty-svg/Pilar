import type { QuoteClient } from '../../types/QuoteEstimate'

interface QuoteStepClientProps {
  client: QuoteClient
  onChange: (patch: Partial<QuoteClient>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}

export default function QuoteStepClient({ client, onChange, onNext, onBack, loading }: QuoteStepClientProps) {
  function canProceed() {
    return client.name.trim() && client.phone.trim() && client.city.trim()
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-neutral-950">Seus dados de contato</h2>
      <p className="mt-2 text-sm text-neutral-500">Para enviar a estimativa e entrar em contato quando necessário.</p>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">Nome completo *</label>
          <input
            value={client.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Seu nome"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">WhatsApp *</label>
          <input
            value={client.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="(00) 00000-0000"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">Cidade *</label>
            <input
              value={client.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="Ex.: Campinas"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">Bairro</label>
            <input
              value={client.neighborhood}
              onChange={(e) => onChange({ neighborhood: e.target.value })}
              placeholder="Ex.: Centro"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onBack} className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed() || loading}
          className="flex-1 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
        >
          {loading ? 'Calculando...' : 'Ver estimativa'}
        </button>
      </div>
    </div>
  )
}
