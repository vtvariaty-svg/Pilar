import { HardHat, Instagram, MessageCircle } from 'lucide-react'
import { env } from '../../utils/env'
import { whatsappLink } from '../../utils/whatsapp'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <HardHat className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold leading-none">{env.companyName}</p>
                <p className="mt-1 text-xs text-neutral-500">Construção • Reforma • Acabamento</p>
              </div>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-600">
              Empreiteira especializada em construção civil, reformas completas e acabamentos em {env.serviceRegion}.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-neutral-900">Contato</p>
            <a
              href={whatsappLink('Olá, gostaria de solicitar um orçamento.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            {env.instagramUrl && (
              <a
                href={env.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            )}
            <p className="text-sm text-neutral-600">{env.serviceRegion}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-neutral-900">Serviços</p>
            {['Construção do zero', 'Reformas completas', 'Ampliações', 'Banheiros e cozinhas', 'Acabamentos', 'Telhados'].map((s) => (
              <p key={s} className="text-sm text-neutral-600">
                {s}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-6">
          <p className="text-xs text-neutral-500">
            © {year} {env.companyName}. Todos os direitos reservados. Construção civil, reformas e acabamentos em {env.serviceRegion}.
          </p>
        </div>
      </div>
    </footer>
  )
}
