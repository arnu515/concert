import ThemeProvider from "$contexts/ThemeContext"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Index from "$r/page"
import New from "./routes/new/page"
import RootLayout from "$r/layouts/Root"
import RootError from "$r/error"
import Signup from "./routes/signup/page"
import newAction from "./routes/new/action"

const queryClient = new QueryClient()

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <RootError />,
		children: [
			{
				path: "/",
				element: <Index />
			},
			{ path: "/new", element: <New />, action: newAction },
			{ path: "/signup", element: <Signup /> },
			{ path: "/login", element: <Signup view="sign_in" /> }
		]
	}
])

export function App() {
	return (
		<>
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</ThemeProvider>
		</>
	)
}
