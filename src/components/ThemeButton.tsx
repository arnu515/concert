import { ThemeContext } from "$/contexts/ThemeContext"
import { useContext } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext)!

  function changeTheme() {
    const newTheme = theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
  }

  return (
    <button
      className="bg-inherit p-2 focus:ring-teal-500"
      onClick={changeTheme}
      title="Change theme"
      aria-label="Change theme"
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </button>
  )
}
