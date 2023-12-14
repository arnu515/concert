import Navbar from "$/components/Navbar"
import { Button } from "$/components/ui/button"
import { ErrorResponse, Link, useRouteError, useNavigate } from "react-router-dom"

export default function RootError() {
  const error = useRouteError() as ErrorResponse
  const navigate = useNavigate()
  console.error(error)

  return (
    <main>
      <div className="fixed z-10 w-full">
        <Navbar />
      </div>
      <div className="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-6">
        <h1 className="font-heading text-5xl font-bold">
          <span className="text-sky-600 dark:text-blue-600">Concert</span>Meetings{" "}
          <span className="text-3xl text-gray-400 dark:text-gray-700">:</span>{" "}
          <span className="font-normal">Error</span>
        </h1>
        <p className="text-center text-lg uppercase text-gray-500">
          <code>
            {error.status} {error.statusText}
          </code>
        </p>
        <p className="text-center text-xl">
          {error.status !== 404 ? error.data : "This page does not exist."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link to="/">Explore Meetings</Link>
          </Button>
          <Button asChild variant="outline">
            <button onClick={() => navigate(-1)}>Go back</button>
          </Button>
        </div>
      </div>
    </main>
  )
}
