import { useState, type FormEvent } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import ClientLayout from '../../components/client/ClientLayout'
import CustomerRoute from '../../components/route/CustomerRoute'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../services/firebase'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function ClientProfilePage() {
  const { user, userProfile } = useAuth()
  const [name, setName] = useState(userProfile?.name ?? '')
  const [phone, setPhone] = useState(userProfile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await updateDoc(doc(db, 'users', user.uid), { name, phone, updatedAt: serverTimestamp() })
    setSaving(false)
    setSaved(true)
  }

  return (
    <CustomerRoute>
      <ClientLayout>
        <div className="mb-6">
          <h1 className="text-xl font-black text-neutral-950">Meu perfil</h1>
          <p className="mt-1 text-sm text-neutral-500">{userProfile?.email}</p>
        </div>

        <form onSubmit={handleSave} className="max-w-sm">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex flex-col gap-4">
              <Input label="Nome completo" value={name} onChange={(e) => { setName(e.target.value); setSaved(false) }} />
              <Input label="Telefone / WhatsApp" value={phone} onChange={(e) => { setPhone(e.target.value); setSaved(false) }} />
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">E-mail</label>
                <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-500">{userProfile?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" loading={saving}>Salvar alterações</Button>
            {saved && <p className="text-sm font-medium text-green-600">Salvo!</p>}
          </div>
        </form>
      </ClientLayout>
    </CustomerRoute>
  )
}
