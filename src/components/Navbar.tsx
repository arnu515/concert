import { AuthContext } from "$/contexts/AuthContext"
import { useContext } from "preact/hooks"
import ThemeButton from "$c/ThemeButton"
import { useComputed } from "@preact/signals"
import { Badge } from "$c/ui/badge"
import Avatar from "./Avatar"
import { Link } from "react-router-dom"

export default function Navbar() {
  const auth = useContext(AuthContext)!
  const user = useComputed(() => auth.value?.user ?? null)

  return (
    <nav class="flex items-center justify-between border-b border-gray-400 bg-gray-200 px-4 py-2 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <Link
        to="/"
        class="font-heading text-lg font-semibold text-sky-600 dark:text-blue-600"
        style={{ letterSpacing: ".2ch" }}
      >
        Concert
      </Link>
      <div class="flex items-center gap-4">
        <ThemeButton />
        <Link to="/" class="font-semibold">
          Explore
        </Link>
        {user.value && (
          <Link to="/invites" class="font-semibold">
            Invites <Badge className="text-sm">3</Badge>
          </Link>
        )}
        <Link
          to={user.value ? "/new" : "/signup"}
          class="border border-gray-700 bg-amber-500 px-2 py-1 font-semibold text-white dark:border-gray-200"
        >
          {user.value ? "Create Stage" : "Sign Up"}
        </Link>
        {user.value && (
          <Link to="/settings">
            <Avatar
              src={user.value.email!}
              alt={user.value.email!}
              fb="ae"
              w="2rem"
              h="2rem"
            />
          </Link>
        )}
      </div>
    </nav>
  )
}
