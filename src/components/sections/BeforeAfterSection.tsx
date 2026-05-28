import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function BeforeAfterSection() {
  return (
    <section className="bg-brand-dark py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
          Transformação
        </p>
        <h2 className="font-serif text-3xl font-bold text-brand-offwhite sm:text-4xl">
          Da condição atual ao resultado entregue.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-brand-limestone/70">
          Enviando fotos do imóvel, nossa equipe avalia o estado atual e orienta as melhores soluções para o resultado desejado.
        </p>

        <div className="mt-14 grid gap-px bg-[#2a2a28] sm:grid-cols-2">
          {/* Before */}
          <div className="group relative overflow-hidden bg-brand-concrete">
            {/* TODO: Replace with real "before" photo */}
            <div className="relative h-80 bg-gradient-to-br from-[#1a1a19] via-[#1e1e1c] to-[#111110]">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.015) 5px, rgba(255,255,255,0.015) 10px)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-6xl font-bold text-white/5">Antes</p>
                  <p className="mt-2 text-xs text-white/20 uppercase tracking-widest">Substituir por foto real</p>
                </div>
              </div>
            </div>
            <div className="border-t border-[#2a2a28] p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-limestone/40">Antes da intervenção</span>
              <p className="mt-2 text-sm text-brand-limestone/60">Estado original do imóvel — desgaste, instalações antigas e acabamento deteriorado.</p>
            </div>
          </div>

          {/* After */}
          <div className="group relative overflow-hidden bg-brand-concrete">
            {/* TODO: Replace with real "after" photo */}
            <div className="relative h-80 bg-gradient-to-br from-[#1a2818] via-[#1e3020] to-[#0f1a14]">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(184,149,91,0.15) 0%, transparent 60%)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-6xl font-bold text-white/5">Depois</p>
                  <p className="mt-2 text-xs text-white/20 uppercase tracking-widest">Substituir por foto real</p>
                </div>
              </div>
            </div>
            <div className="border-t border-[#2a2a28] p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold/60">Após a obra Pilar</span>
              <p className="mt-2 text-sm text-brand-limestone/60">Resultado entregue — acabamento fino, instalações novas e padrão elevado.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/obras"
            className="inline-flex items-center gap-2 border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-semibold text-brand-dark transition hover:bg-[#c9a76a]"
          >
            Ver portfólio de obras <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 border border-[#3a3a38] px-8 py-4 text-sm font-semibold text-brand-limestone/70 transition hover:border-brand-limestone/60 hover:text-brand-limestone"
          >
            Enviar fotos do meu imóvel
          </Link>
        </div>
      </div>
    </section>
  )
}
