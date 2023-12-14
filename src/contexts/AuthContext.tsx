import { createContext, PropsWithChildren, useEffect, useState } from "react"
import supabase from "$util/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"
import { Database } from "$/util/dbTypes"
import * as cache from "$util/cache"

interface AuthState {
  session: Session | null
  user: User | null
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null
}

export const AuthContext = createContext<AuthState | null | undefined>(undefined)

export async function fetchProfile(userId?: string | null, rwd = false) {
  if (!userId) return null

  // fetch from cache
  const profileFromCache = rwd
    ? null
    : await cache.get(`profile:${userId}`, undefined, 600000) // 10m
  if (profileFromCache) return profileFromCache as AuthState["profile"]

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!data || error) {
    console.error(error)
    return null
  }

  // cache
  await cache.put(`profile:${userId}`, data)

  return data
}

export default function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState | null | undefined>(undefined)

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setAuthState(null)
        return
      }
      setAuthState({
        session,
        user: session.user,
        profile: await fetchProfile(session.user.id)
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={authState}>
      {typeof authState === "undefined" ? (
        <div className="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin duration-500" size={64} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
