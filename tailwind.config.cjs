/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "index.html"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter Variable", "sans-serif"],
				heading: ["Handjet Variable", "sans-serif"]
			}
		}
	},
	plugins: []
}
