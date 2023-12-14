import { cn } from "$/util/ui"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import supabase from "$/util/supabase"
import { useContext } from "react"
import { AuthContext } from "$/contexts/AuthContext"
import { Link } from "react-router-dom"

export default function RequestToJoin({
  stageId,
  className
}: {
  stageId: string
  className?: string
}) {
  const client = useQueryClient()
  const auth = useContext(AuthContext)

  const { isPending, data } = useQuery({
    queryKey: ["requestToJoin", stageId],
    queryFn: async ({ signal }) => {
      if (!auth?.user) return null
      const { data } = await supabase
        .from("join_requests")
        .select("*")
        .eq("stage_id", stageId)
        .eq("from_id", auth.user.id)
        .abortSignal(signal)
        .maybeSingle()
      return data ?? null
    }
  })

  const {
    isPending: isMutationPending,
    isError,
    error,
    mutate
  } = useMutation({
    mutationFn: async () => {
      if (isPending) return
      const { error } = await supabase.from("join_requests").insert({
        stage_id: stageId
      })
      if (error) throw new Error(error.message)
      client.invalidateQueries({ queryKey: ["requestToJoin", stageId] })
    }
  })

  return (
    <div
      className={cn(
        "flex flex-col justify-center rounded-md border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isPending || isMutationPending ? (
          <Loader2 size={20} className="animate-spin duration-300" />
        ) : (
          <AlertCircle size={20} />
        )}
        <h3 className="text-2xl font-semibold">
          {!data
            ? "This stage is Invite-Only"
            : "You have requested to join this stage"}
        </h3>
      </div>
      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Could not join stage</AlertTitle>
          <AlertDescription>
            {error.message || "An unknown error occured."}
          </AlertDescription>
        </Alert>
      )}
      {data ? (
        <p className="text-gray-700 dark:text-gray-300">
          Please wait for the Stage owner to invite you.
        </p>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          You must be invited to this stage to be allowed to join. You have not been
          invited yet. <br />
          You can ask to join this stage by clicking the button below.
        </p>
      )}
      <Button className="mt-2" asChild size="lg">
        {data ? (
          <Link to="/">Explore other stages</Link>
        ) : (
          <button onClick={() => mutate()} disabled={isMutationPending || isPending}>
            Request to Join Stage
          </button>
        )}
      </Button>
    </div>
  )
}
