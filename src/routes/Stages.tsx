import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query"
import supabase from "$/util/supabase"
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react"
import StageCard from "$/components/StageCard"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "$/components/ui/button"
import { Skeleton } from "$/components/ui/skeleton"

const PER_PAGE = 15

export default function Stages() {
  const [page, setPage] = useState(0)
  const queryClient = useQueryClient()
  const {
    data: count,
    isPending: isCountPending,
    isError: isCountError
  } = useQuery({
    queryKey: ["stages", "count"],
    queryFn: async ({ signal }) => {
      const { error, count } = await supabase
        .from("stages")
        .select("id", { count: "exact" })
        .abortSignal(signal)
      if (error || !count) throw new Error(error?.message || "Could not fetch count")
      return count
    }
  })
  const { data, error, isPending, isFetching, isError } = useQuery({
    queryKey: ["stages", "page", page],
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const { error, data } = await supabase
        .from("stages")
        .select("*")
        .range(page * PER_PAGE, page * PER_PAGE + PER_PAGE - 1)
        .order("created_at", { ascending: false })
        .abortSignal(signal)
      if (error) throw new Error(error.message)
      return data
    }
  })

  if (isPending)
    return (
      <div className="m-4">
        <Loader2 className="animate-spin" />
      </div>
    )
  if (isError)
    return <span className="text-red-500">Could not fetch stages: {error.message}</span>

  return (
    <section className="flex flex-col gap-2">
      <div className="flex gap-2">
        <p className="text-lg text-gray-700 dark:text-gray-400">
          To join a stage, simply click on any of these stages listed below. If a stage
          is set to invite-only, you'll be prompted to send a Join request instead.
        </p>
        <div className="flex flex-col items-center justify-center gap-1">
          <Button size="icon" variant="secondary" asChild>
            <button
              aria-label="Refresh"
              title="Refresh"
              className="p-2"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["stages"] })}
            >
              <RefreshCw size={16} />
            </button>
          </Button>
          {isFetching && <Loader2 size={16} className="animate-spin" />}
        </div>
      </div>
      {data.map(stage => (
        <Link to={`/stage/${stage.id}`} key={stage.id} className="w-full">
          <StageCard
            stage={stage}
            className="transition-all duration-200 hover:brightness-90"
          />
        </Link>
      ))}
      <aside className="flex items-center justify-between">
        <Button asChild variant="secondary" size="icon">
          <button
            onClick={() => setPage(p => (p > 0 ? p - 1 : p))}
            disabled={page === 0}
            title="Previous page"
            aria-label="Go to the previous page"
          >
            <ChevronLeft />
          </button>
        </Button>
        <span className="text-gray-700 dark:text-gray-400">
          Page {page + 1} of{" "}
          {isCountPending || isCountError ? (
            <Skeleton className="h-4 w-4" />
          ) : (
            Math.ceil(count / PER_PAGE)
          )}{" "}
          <span className="text-gray-400 dark:text-gray-700">::</span> Showing{" "}
          {page * PER_PAGE + 1} to {page * PER_PAGE + data.length} out of {count} stages
        </span>
        <Button asChild variant="secondary" size="icon">
          <button
            disabled={page >= Math.ceil((count || 0) / PER_PAGE)}
            onClick={() =>
              setPage(p => (p < Math.ceil((count || 0) / PER_PAGE) - 1 ? p + 1 : p))
            }
            title="Next page"
            aria-label="Go to the next page"
          >
            <ChevronRight />
          </button>
        </Button>
      </aside>
    </section>
  )
}
