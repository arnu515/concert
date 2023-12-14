import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import supabase from "$util/supabase"
import { useContext, useState } from "react"
import { ThemeContext } from "$contexts/ThemeContext"
import { AuthContext } from "$/contexts/AuthContext"
import { Button } from "$c/ui/button"
import { Loader2 } from "lucide-react"

export default function Auth() {
  const { theme } = useContext(ThemeContext)!
  const auth = useContext(AuthContext)!
  const [isSigningOut, setSigningOut] = useState(false)

  return (
    <div className="border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800">
      {auth?.session ? (
        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-xl font-semibold">You're already signed in</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Signed in to <code>{auth!.user?.email}</code>
          </p>
          <Button variant="destructive" asChild disabled={isSigningOut}>
            <button
              onClick={() => {
                setSigningOut(true)
                supabase.auth.signOut().finally(() => {
                  setSigningOut(false)
                })
              }}
              disabled={isSigningOut}
            >
              {isSigningOut && <Loader2 className="mr-1 animate-spin" size={16} />}
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
          theme={theme}
          providers={["github", "gitlab"]}
        />
      )}
    </div>
  )
}
