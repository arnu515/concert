import { AuthContext } from "$/contexts/AuthContext"
import { useContext } from "preact/hooks"
import ThemeButton from "$c/ThemeButton"
import { useComputed } from "@preact/signals"
import { Badge } from "$c/ui/badge"

export default function Navbar() {
  const auth = useContext(AuthContext)!
  const user = useComputed(() => auth.value?.user ?? null)

  return (
    <nav class="flex items-center justify-between border-b border-gray-400 bg-gray-200 px-4 py-2 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <a
        href="/"
        class="font-heading text-lg font-semibold text-sky-600"
        style={{ letterSpacing: ".2ch" }}
      >
        Concert
      </a>
      <div class="flex items-center gap-4">
        <ThemeButton />
        <a href="/" class="font-semibold">
          Explore
        </a>
        {user.value && (
          <a href="/invites" class="font-semibold">
            Invites <Badge className="text-sm">3</Badge>
          </a>
        )}
        <a
          href={user.value ? "/new" : "/signup"}
          class="border border-gray-700 bg-amber-500 px-2 py-1 font-semibold text-white dark:border-white"
        >
          {user.value ? "Create Stage" : "Sign Up"}
        </a>
      </div>
    </nav>
  )
}
