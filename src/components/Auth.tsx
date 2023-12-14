import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa, ViewType } from "@supabase/auth-ui-shared"
import supabase from "$util/supabase"
import { useContext, useState } from "react"
import { ThemeContext } from "$contexts/ThemeContext"
import { AuthContext } from "$/contexts/AuthContext"
import { Button } from "$c/ui/button"
import { Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Auth({ view = "sign_up" }: { view?: ViewType }) {
  const { theme } = useContext(ThemeContext)!
  const auth = useContext(AuthContext)!
  const [isSigningOut, setSigningOut] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800">
      {auth?.session ? (
        <div className="flex flex-col justify-center gap-2">
          <h3 className="my-4 text-2xl font-semibold">You're signed in</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Signed in to <code>{auth!.user?.email}</code>
          </p>
          <div className="grid grid-cols-2 items-center gap-1">
            <Button asChild>
              <Link to="/">Homepage</Link>
            </Button>
            <Button asChild variant="outline">
              <button onClick={() => navigate(-1)}>Go back</button>
            </Button>
          </div>
          <button
            className="flex items-center justify-center gap-1 bg-inherit px-2 py-1 text-red-500"
            onClick={() => {
              setSigningOut(true)
              supabase.auth.signOut().finally(() => {
                setSigningOut(false)
              })
            }}
            disabled={isSigningOut}
          >
            {isSigningOut && <Loader2 className="animate-spin" size={16} />}
            Sign{isSigningOut && "ing"} out
          </button>
        </div>
      ) : (
        <SupabaseAuth
          view={view}
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
