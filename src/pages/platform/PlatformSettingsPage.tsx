import PlatformLayout from '../../components/platform/PlatformLayout'
import PlatformAdminRoute from '../../components/route/PlatformAdminRoute'

export default function PlatformSettingsPage() {
  return (
    <PlatformAdminRoute>
      <PlatformLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-white">Configurações da plataforma</h1>
          <p className="mt-1 text-sm text-white/50">Configurações globais do sistema</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/40">
          Configurações globais — em desenvolvimento.
        </div>
      </PlatformLayout>
    </PlatformAdminRoute>
  )
}
