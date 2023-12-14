import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { cn } from "$/util/ui"

export default function FullPageError({
  message,
  friendlyMessage,
  className
}: {
  message?: string
  friendlyMessage?: string
  className?: string
}) {
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 overflow-hidden",
        className
      )}
    >
      <h1 className="font-heading text-5xl font-bold">
        <span className="hidden sm:inline">
          <span className="text-sky-600 dark:text-blue-600">Concert</span>Meetings{" "}
          <span className="text-3xl text-gray-400 dark:text-gray-700">:</span>{" "}
        </span>
        <span className="font-normal">Error</span>
      </h1>
      {message && (
        <p className="text-center text-lg uppercase text-gray-500">
          <code>{message}</code>
        </p>
      )}
      {friendlyMessage && <p className="text-center text-xl">{friendlyMessage}</p>}
      <div className="flex items-center justify-center gap-4">
        <Button asChild>
          <Link to="/">Explore Meetings</Link>
        </Button>
        <Button asChild variant="outline">
          <button onClick={() => navigate(-1)}>Go back</button>
        </Button>
      </div>
    </div>
  )
}
