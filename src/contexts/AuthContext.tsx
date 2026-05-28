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
import { createAdminUser } from '../services/adminUserService'
import { checkPendingInvite, acceptAdminInvite } from '../services/userManagementService'
import type { UserProfile } from '../types/UserProfile'
import type { TenantMember } from '../types/TenantMember'
import type { AdminUser } from '../types/AdminUser'

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
  adminUserData: AdminUser | null
  isAdminUser: boolean
  isSuperAdminUser: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    profile: { name: string; phone: string },
  ) => Promise<string>
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
  const [adminUserData, setAdminUserData] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true)
      setUser(u)

      if (!u) {
        setUserProfile(null)
        setTenantMemberState(null)
        setAdminUserData(null)
        setLoading(false)
        return
      }

      try {
        const [profileSnap, memberSnap, adminSnap] = await Promise.all([
          getDoc(doc(db, 'users', u.uid)),
          getDoc(doc(db, `tenants/${DEFAULT_TENANT}/members`, u.uid)),
          getDoc(doc(db, 'adminUsers', u.uid)),
        ])

        const adminData = adminSnap.exists()
          ? ({ uid: u.uid, ...adminSnap.data() } as AdminUser)
          : null

        setUserProfile(profileSnap.exists() ? ({ uid: u.uid, ...profileSnap.data() } as UserProfile) : null)
        setAdminUserData(adminData)

        if (memberSnap.exists()) {
          setTenantMemberState({ uid: u.uid, ...memberSnap.data() } as TenantMember)
        } else if (adminData?.active === true) {
          setTenantMemberState({
            uid: u.uid,
            tenantId: DEFAULT_TENANT,
            role: adminData.role === 'super_admin' ? 'owner' : 'admin',
            createdAt: null as never,
            updatedAt: null as never,
          })
        } else {
          setTenantMemberState(null)
        }
      } catch (err) {
        console.error('[AuthContext] failed to load user context', err)
        setUserProfile(null)
        setTenantMemberState(null)
        setAdminUserData(null)
      } finally {
        setLoading(false)
      }
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
  ): Promise<string> {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const uid = cred.user.uid
    await createUserProfile(uid, { email, ...profile })

    const invite = await checkPendingInvite(email)
    if (invite) {
      await createAdminUser({ uid, email, name: profile.name, role: invite.role, active: true })
      await setTenantMember(
        DEFAULT_TENANT,
        uid,
        invite.role === 'super_admin' ? 'owner' : 'admin',
        { displayName: profile.name, email },
      )
      await acceptAdminInvite(invite.id)
    } else {
      await createCustomer(uid, { email, ...profile, tenantId: DEFAULT_TENANT })
      await setTenantMember(DEFAULT_TENANT, uid, 'customer', { displayName: profile.name, email })
    }

    return uid
  }

  async function logout() {
    await signOut(auth)
  }

  const isPlatformAdmin = adminUserData?.role === 'super_admin' && adminUserData?.active === true
  const role = tenantMember?.role ?? null
  const isTenantOwner = role === 'owner'
  const isTenantAdmin = role === 'admin' || isTenantOwner
  const isTenantOperator = role === 'operator' || isTenantAdmin
  const isTenantStaff = isTenantOperator || isPlatformAdmin
  const isCustomer = role === 'customer'
  const isAdminUser = (adminUserData?.active === true) || isTenantStaff
  const isSuperAdminUser = adminUserData?.role === 'super_admin' && adminUserData?.active === true

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
        adminUserData,
        isAdminUser,
        isSuperAdminUser,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
