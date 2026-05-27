import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import { createUserProfile } from '../services/userService'
import { createCustomer } from '../services/customerService'
import { setTenantMember } from '../services/membershipService'
import type { UserProfile } from '../types/UserProfile'
import type { TenantMember } from '../types/TenantMember'

const DEFAULT_TENANT = 'pilar'

interface AuthContextValue {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isPlatformAdmin: boolean
  currentTenantId: string
  currentTenantMember: TenantMember | null
  isTenantOwner: boolean
  isTenantAdmin: boolean
  isTenantOperator: boolean
  isTenantStaff: boolean
  isCustomer: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    profile: { name: string; phone: string },
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [tenantMember, setTenantMemberState] = useState<TenantMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setUserProfile(null)
        setTenantMemberState(null)
        setLoading(false)
        return
      }

      const profileSnap = await getDoc(doc(db, 'users', u.uid))
      setUserProfile(profileSnap.exists() ? ({ uid: u.uid, ...profileSnap.data() } as UserProfile) : null)

      const memberSnap = await getDoc(doc(db, `tenants/${DEFAULT_TENANT}/members`, u.uid))
      if (memberSnap.exists()) {
        setTenantMemberState({ uid: u.uid, ...memberSnap.data() } as TenantMember)
      } else {
        const legacySnap = await getDoc(doc(db, 'adminUsers', u.uid))
        setTenantMemberState(
          legacySnap.exists()
            ? ({ uid: u.uid, tenantId: DEFAULT_TENANT, role: 'admin', createdAt: null as never, updatedAt: null as never })
            : null,
        )
      }

      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function signUp(
    email: string,
    password: string,
    profile: { name: string; phone: string },
  ) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const uid = cred.user.uid
    await createUserProfile(uid, { email, ...profile })
    await createCustomer(uid, { email, ...profile, tenantId: DEFAULT_TENANT })
    await setTenantMember(DEFAULT_TENANT, uid, 'customer', { displayName: profile.name, email })
  }

  async function logout() {
    await signOut(auth)
  }

  const isPlatformAdmin = userProfile?.globalRole === 'platform_admin'
  const role = tenantMember?.role ?? null
  const isTenantOwner = role === 'owner'
  const isTenantAdmin = role === 'admin' || isTenantOwner
  const isTenantOperator = role === 'operator' || isTenantAdmin
  const isTenantStaff = isTenantOperator || isPlatformAdmin
  const isCustomer = role === 'customer'

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        userProfile,
        loading,
        isPlatformAdmin,
        currentTenantId: DEFAULT_TENANT,
        currentTenantMember: tenantMember,
        isTenantOwner,
        isTenantAdmin,
        isTenantOperator,
        isTenantStaff,
        isCustomer,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
