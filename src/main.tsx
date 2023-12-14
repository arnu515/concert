import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App.tsx"
import "@fontsource-variable/inter"
import "@fontsource-variable/handjet"
import "./index.postcss"
import "@livekit/components-styles"

  // For livekit
  ; (window as any).process = { env: { NODE_ENV: "development" } }

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
