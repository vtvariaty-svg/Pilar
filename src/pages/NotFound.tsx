import { Link } from 'react-router-dom'
import { HardHat, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-lg">
        <HardHat className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-4xl font-black text-neutral-950">404</h1>
      <p className="mt-2 text-lg font-semibold text-neutral-700">Página não encontrada</p>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o início
      </Link>
    </div>
  )
}
