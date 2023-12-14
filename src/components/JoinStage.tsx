import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"

export default function JoinStage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="flex flex-col justify-center gap-2 border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800">
      <h3 className="my-4 text-2xl font-semibold">Join stage</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Enter a stage's ID to join it, or ask to join it, if it is invite-only.
      </p>
      <form
        className="flex flex-col justify-center gap-2"
        onSubmit={e => {
          e.preventDefault()
          const fd = new FormData(e.target as HTMLFormElement)
          const id = fd.get("id") as string
          if (typeof id !== "string") setError("Please enter an ID")
          else if (id.trim().length !== 9) setError("Please enter a valid ID")
          else navigate(`/stage/${id.trim().toUpperCase()}`)
        }}
      >
        <Input
          placeholder="Enter stage ID"
          minLength={9}
          maxLength={9}
          required
          name="id"
          aria-label="Stage ID"
        />
        <p className="text-sm text-red-500">{error ? error : ""}</p>
        <Button type="submit" variant="outline">
          Join stage
        </Button>
      </form>
      <Link
        className="gap-1 bg-inherit px-2 py-1 text-center text-sm text-gray-700 dark:text-gray-300"
        to="/new"
      >
        Create a stage
      </Link>
    </div>
  )
}
