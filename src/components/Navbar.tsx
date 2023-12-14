import { AuthContext } from "$/contexts/AuthContext"
import ThemeButton from "$c/ThemeButton"
import { useContext, useMemo } from "react"
import { Badge } from "$c/ui/badge"
import Avatar from "./Avatar"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { ChevronDown } from "lucide-react"

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
      <div className="hidden items-center gap-4 md:flex">
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
            <Avatar
              src={auth.profile?.avatar_url}
              alt={`${auth.profile?.username}'s avatar`}
              fb="ae"
              w="2rem"
              h="2rem"
            />
          </Link>
        )}
      </div>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Expand dropdown"
              title="Click to expand dropdown"
              className="flex items-center justify-center"
            >
              {user ? (
                <Avatar
                  src={auth.profile?.avatar_url}
                  alt={`${auth.profile?.username}'s avatar`}
                  fb="ae"
                  w="2rem"
                  h="2rem"
                />
              ) : (
                <ChevronDown />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {user ? (
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-4">
                    <Avatar
                      src={auth.profile?.avatar_url}
                      alt={`${auth.profile?.username}'s avatar`}
                      fb="ae"
                      w="2rem"
                      h="2rem"
                    />
                    <div className="flex flex-col justify-center gap-1">
                      <span className="truncate font-semibold">
                        {auth.profile?.username}
                      </span>
                      <span className="text-sm font-light text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <ThemeButton />
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/" className="font-semibold">
                  Explore
                </Link>
              </DropdownMenuItem>
              {user && (
                <DropdownMenuItem asChild>
                  <Link to="/invites" className="font-semibold">
                    Invites <Badge className="ml-2 text-sm">3</Badge>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  to={user ? "/new" : "/signup"}
                  className="border border-gray-700 bg-amber-500 px-2 py-1 font-semibold text-white dark:border-gray-200"
                >
                  {user ? "Create Stage" : "Sign Up"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ThemeButton />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
