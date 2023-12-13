import { AuthContext } from "$/contexts/AuthContext"
import { useContext } from "preact/hooks"
import ThemeButton from "$c/ThemeButton"

export default function Navbar() {
  const auth = useContext(AuthContext)

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
        <a
          href="/signup"
          class="border border-gray-700 bg-amber-500 px-2 py-1 font-semibold text-white dark:border-white"
        >
          Sign Up
        </a>
      </div>
    </nav>
  )
}
