import { createContext } from "preact"
import { useSignal, Signal, effect } from "@preact/signals"
import { useEffect } from "preact/hooks"

export const ThemeContext = createContext<Signal<"light" | "dark"> | undefined>(
  undefined
)

export default function ThemeProvider({ children }: { children: any }) {
  const theme = useSignal<"light" | "dark">("light")

  useEffect(() => {
    // load theme from localStorage
    const themeFromLS = localStorage.getItem("theme")
    if (themeFromLS)
      if (["light", "dark"].includes(themeFromLS)) {
        theme.value = themeFromLS as "light" | "dark"
      } else localStorage.removeItem("theme")
    else {
      // load theme from media query
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      if (darkModeMediaQuery.matches) theme.value = "dark"
      else theme.value = "light"
    }

    // automatically add class to <html>
    const unsub = effect(() => {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme.value)
    })

    return unsub
  }, [])

  return (
    <ThemeContext.Provider value={theme}>
      {typeof theme !== "undefined" && children}
    </ThemeContext.Provider>
  )
}
