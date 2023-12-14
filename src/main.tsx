import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App.tsx"
import "@fontsource-variable/inter"
import "@fontsource-variable/handjet"
import "./index.postcss"

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
