import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import supabase from "$util/supabase"
import { useContext } from "preact/hooks"
import { ThemeContext } from "$contexts/ThemeContext"
import { AuthContext } from "$/contexts/AuthContext"
import { Button } from "$c/ui/button"
import { useSignal } from "@preact/signals"
import { Loader2 } from "lucide-react"

export default function Auth() {
  const theme = useContext(ThemeContext)!
  const auth = useContext(AuthContext)!
  const isSigningOut = useSignal(false)

  return (
    <div class="border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800">
      {auth.value?.session ? (
        <div class="flex flex-col justify-center gap-2">
          <h3 class="text-xl font-semibold">You're already signed in</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Signed in to <code>{auth.value!.user?.email}</code>
          </p>
          <Button variant="destructive" asChild disabled={isSigningOut.value}>
            <button
              onClick={() => {
                isSigningOut.value = true
                supabase.auth.signOut().finally(() => {
                  isSigningOut.value = false
                })
              }}
              disabled={isSigningOut.value}
            >
              {isSigningOut.value && (
                <Loader2 className="mr-1 animate-spin" size={16} />
              )}
              Sign out
            </button>
          </Button>
        </div>
      ) : (
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brandAccent: "#0284c7",
                  brand: "#38bdf8",
                  brandButtonText: "black"
                }
              },
              dark: {
                colors: {
                  brandAccent: "#2563eb",
                  brand: "#38bdf8",
                  brandButtonText: "white"
                }
              }
            }
          }}
          theme={theme.value}
          providers={["github", "gitlab"]}
        />
      )}
    </div>
  )
}
