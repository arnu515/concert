import AuthProvider from "$contexts/AuthContext"
import ThemeProvider from "$contexts/ThemeContext"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Index from "$r/index"
import RootLayout from "$r/layouts/Root"

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				path: "/",
				element: <Index />
			}
		]
	}
])

export function App() {
	return (
		<>
			<ThemeProvider>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}
