import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext<{
  theme: "light" | "dark" | undefined
  setTheme: CallableFunction
}>({ theme: "light", setTheme: () => { } })

export default function ThemeProvider({ children }: { children: any }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // load theme from localStorage
    const themeFromLS = localStorage.getItem("theme")
    if (themeFromLS)
      if (["light", "dark"].includes(themeFromLS)) {
        setTheme(themeFromLS as "light" | "dark")
      } else localStorage.removeItem("theme")
    else {
      // load theme from media query
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      if (darkModeMediaQuery.matches) setTheme("dark")
      else setTheme("light")
    }
  }, [])

  useEffect(() => {
    // automatically add class to <html>
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {typeof theme !== "undefined" && children}
    </ThemeContext.Provider>
  )
}
