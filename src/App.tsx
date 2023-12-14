import ThemeProvider from "$contexts/ThemeContext"
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { queryClient, persister } from "$util/queryClient"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Index from "$r/page"
import New from "$r/new/page"
import RootLayout from "$r/layouts/Root"
import RootError from "$r/error"
import Signup from "$r/signup/page"
import newAction from "$r/new/action"
import StageStageIdPage from "$r/stage/[stageId]/page"
import StageStageIdError from "$r/stage/[stageId]/error"

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
			{ path: "/login", element: <Signup view="sign_in" /> },
			{ path: "/stage", loader: () => redirect("/") },
			{
				path: "/stage/:stageId",
				element: <StageStageIdPage />,
				errorElement: <StageStageIdError />
			}
		]
	}
])

export function App() {
	return (
		<>
			<ThemeProvider>
				<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
					<RouterProvider router={router} />
					<ReactQueryDevtools initialIsOpen={false} />
				</PersistQueryClientProvider>
			</ThemeProvider>
		</>
	)
}
