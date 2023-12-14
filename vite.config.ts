import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			$util: resolve("./src/util"),
			$c: resolve("./src/components"),
			$r: resolve("./src/routes"),
			$contexts: resolve("./src/contexts"),
			$: resolve("./src")
		}
	}
})
