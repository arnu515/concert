import FullPageError from "$/components/FullPageError"
import Navbar from "$/components/Navbar"
import { ErrorResponse, useRouteError } from "react-router-dom"

export default function RootError() {
  const error = useRouteError() as ErrorResponse
  console.error(error)

  return (
    <main>
      <div className="fixed z-10 w-full">
        <Navbar />
      </div>
      <FullPageError
        className="fixed left-0 top-0 h-full w-full"
        friendlyMessage={
          error.status === 404
            ? "This page or resource does not exist."
            : error.data?.message ||
            error.data?.error ||
            error.data?.error?.message ||
            "An unknown error occured."
        }
        message={error.status ? `${error.status} ${error.statusText}` : undefined}
      />
    </main>
  )
}
