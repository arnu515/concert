import { createContext, ComponentChild } from "preact"
import supabase from "$util/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { useEffect } from "preact/hooks"
import { Signal, useSignal } from "@preact/signals"
import { Loader2 } from "lucide-react"

interface AuthState {
  session: Session | null
  user: User | null
  profile: null // TODO
}

export const AuthContext = createContext<
  Signal<AuthState | null | undefined> | undefined
>(undefined)

export async function fetchProfile(userId: string) {
  return null
} // TODO

export default function AuthProvider({ children }: { children: ComponentChild }) {
  const authState = useSignal<AuthState | null | undefined>(undefined)

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        authState.value = null
        return
      }
      authState.value = {
        session,
        user: session.user,
        profile: await fetchProfile(session.user.id)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={authState}>
      {typeof authState === "undefined" || typeof authState.value === "undefined" ? (
        <div class="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin duration-500" size={64} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
