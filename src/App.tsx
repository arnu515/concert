import AuthProvider from "$contexts/AuthContext"

export function App() {
	return (
		<>
			<AuthProvider>
				<h1 class="text-center font-heading text-5xl">Hello, world!</h1>
			</AuthProvider>
		</>
	)
}
