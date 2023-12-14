import { AuthContext } from "$/contexts/AuthContext"
import ThemeButton from "$c/ThemeButton"
import { useContext, useMemo } from "react"
import { Badge } from "$c/ui/badge"
import Avatar from "./Avatar"
import { Link } from "react-router-dom"

export default function Navbar() {
  const auth = useContext(AuthContext)!
  const user = useMemo(() => auth?.user ?? null, [auth])

  return (
    <nav className="flex items-center justify-between border-b border-gray-400 bg-gray-200 px-4 py-2 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <Link
        to="/"
        className="font-heading text-lg font-semibold text-sky-600 dark:text-blue-600"
        style={{ letterSpacing: ".2ch" }}
      >
        Concert
      </Link>
      <div className="flex items-center gap-4">
        <ThemeButton />
        <Link to="/" className="font-semibold">
          Explore
        </Link>
        {user && (
          <Link to="/invites" className="font-semibold">
            Invites <Badge className="text-sm">3</Badge>
          </Link>
        )}
        <Link
          to={user ? "/new" : "/signup"}
          className="border border-gray-700 bg-amber-500 px-2 py-1 font-semibold text-white dark:border-gray-200"
        >
          {user ? "Create Stage" : "Sign Up"}
        </Link>
        {user && (
          <Link to="/settings">
            <Avatar src={user.email!} alt={user.email!} fb="ae" w="2rem" h="2rem" />
          </Link>
        )}
      </div>
    </nav>
  )
}
