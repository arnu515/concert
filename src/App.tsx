import ThemeProvider from "$contexts/ThemeContext"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Index from "$r/page"
import RootLayout from "$r/layouts/Root"
import RootError from "$r/error"

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <RootError />,
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
				<RouterProvider router={router} />
			</ThemeProvider>
		</>
	)
}
