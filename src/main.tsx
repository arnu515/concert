import { render } from "preact"
import { App } from "./App.tsx"
import "@fontsource-variable/inter"
import "@fontsource-variable/handjet"
import "./index.postcss"

render(<App />, document.getElementById("app")!)
