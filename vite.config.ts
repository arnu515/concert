import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
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
