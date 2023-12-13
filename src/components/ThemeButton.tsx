import { ThemeContext } from "$/contexts/ThemeContext"
import { useContext } from "preact/hooks"
import { Sun, Moon } from "lucide-react"

export default function ThemeButton() {
  const theme = useContext(ThemeContext)!

  function changeTheme() {
    const newTheme = theme.peek() === "light" ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    theme.value = newTheme
  }

  return (
    <button class="bg-inherit p-2 focus:ring-teal-500" onClick={changeTheme}>
      {theme.value === "light" ? <Sun /> : <Moon />}
    </button>
  )
}
