import AuthProvider from "$contexts/AuthContext"
import ThemeProvider from "$contexts/ThemeContext"

export function App() {
	return (
		<>
			<ThemeProvider>
				<AuthProvider>
					<h1 class="text-center font-heading text-5xl">Hello, world!</h1>
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}
