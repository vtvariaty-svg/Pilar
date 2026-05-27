import readline from 'readline'

const API_KEY   = 'AIzaSyDQeDjaIhDjglRJbgLiT3VMTO4Ikj1OdqE'
const PROJECT   = 'projeto-empreita'
const AUTH_URL  = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
const FS_BASE   = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()) }))
}

function toFirestoreDoc(obj) {
  function convert(val) {
    if (typeof val === 'string')  return { stringValue: val }
    if (typeof val === 'boolean') return { booleanValue: val }
    if (typeof val === 'number')  return { integerValue: String(val) }
    if (val && typeof val === 'object' && val._seconds !== undefined)
      return { timestampValue: new Date(val._seconds * 1000).toISOString() }
    if (val instanceof Date) return { timestampValue: val.toISOString() }
    return { nullValue: null }
  }
  const fields = {}
  for (const [k, v] of Object.entries(obj)) fields[k] = convert(v)
  return { fields }
}

async function fsSet(idToken, path, data) {
  const now = new Date()
  const body = toFirestoreDoc({ ...data, createdAt: now, updatedAt: now })
  const url = `${FS_BASE}/${path}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json))
  return json
}

console.log('\n=== Setup Firestore — Pilar Empreendimentos ===\n')

const email    = await ask('Email do admin: ')
const password = await ask('Senha: ')

console.log('\nFazendo login...')
const authRes = await fetch(AUTH_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, returnSecureToken: true }),
})
const authData = await authRes.json()
if (!authData.idToken) {
  console.error(`\n✗ Login falhou: ${authData.error?.message || JSON.stringify(authData)}`)
  process.exit(1)
}
const { idToken, localId: uid } = authData
console.log(`✓ Logado como ${email}`)
console.log(`  UID: ${uid}`)

console.log('\nCriando documentos no Firestore...')

try {
  await fsSet(idToken, 'tenants/pilar', {
    id: 'pilar', name: 'Pilar Empreendimentos', slug: 'pilar', active: true,
  })
  console.log('✓ tenants/pilar')
} catch (e) { console.error(`✗ tenants/pilar: ${e.message}`); process.exit(1) }

try {
  await fsSet(idToken, `tenants/pilar/members/${uid}`, {
    uid, tenantId: 'pilar', role: 'owner',
    displayName: email.split('@')[0], email,
  })
  console.log(`✓ tenants/pilar/members/${uid}`)
} catch (e) { console.error(`✗ member: ${e.message}`); process.exit(1) }

try {
  await fsSet(idToken, `users/${uid}`, {
    uid, email, name: email.split('@')[0], globalRole: 'platform_admin',
  })
  console.log(`✓ users/${uid} (globalRole: platform_admin)`)
} catch (e) { console.error(`✗ users: ${e.message}`); process.exit(1) }

console.log('\n✅ Setup concluído! Entre em https://projeto-empreita.web.app/entrar\n')
process.exit(0)
