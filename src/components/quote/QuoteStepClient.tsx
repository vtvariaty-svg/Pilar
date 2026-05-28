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

  const inputClass = 'w-full border border-[#2a2a28] bg-[#111110] px-4 py-3 text-sm text-brand-offwhite placeholder-brand-limestone/25 outline-none focus:border-brand-gold/50 transition'
  const labelClass = 'mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/50'

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold mb-3">Etapa 3 de 3</p>
      <h2 className="font-serif text-2xl font-bold text-brand-offwhite">Seus dados de contato</h2>
      <p className="mt-2 text-sm text-brand-limestone/60">
        Utilizaremos esses dados para enviar a estimativa e entrar em contato para agendar a visita técnica.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <div>
          <label className={labelClass}>Nome completo</label>
          <input
            value={client.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Seu nome"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>WhatsApp</label>
          <input
            value={client.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="(00) 00000-0000"
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Cidade</label>
            <input
              value={client.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="Ex.: Pilar do Sul"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Bairro (opcional)</label>
            <input
              value={client.neighborhood}
              onChange={(e) => onChange({ neighborhood: e.target.value })}
              placeholder="Ex.: Centro"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border border-[#1e1e1c] bg-[#111110] p-4">
        <p className="text-xs text-brand-limestone/40 leading-5">
          Seus dados são usados apenas para contato e envio da estimativa. A próxima etapa é a visita técnica, gratuita e sem compromisso.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#2a2a28] px-6 py-3.5 text-sm font-semibold text-brand-limestone/60 transition hover:border-brand-limestone/30 hover:text-brand-limestone"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed() || loading}
          className="flex-1 border border-brand-gold bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-dark transition hover:bg-[#c9a76a] disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin border-2 border-brand-dark/30 border-t-brand-dark" />
              Calculando...
            </span>
          ) : 'Ver estimativa'}
        </button>
      </div>
    </div>
  )
}
