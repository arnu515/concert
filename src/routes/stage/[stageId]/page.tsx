import { Badge } from "$/components/ui/badge"
import { Button } from "$/components/ui/button"
import { AuthContext } from "$/contexts/AuthContext"
import supabase from "$/util/supabase"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useContext } from "react"
import { useParams } from "react-router-dom"
import RequestToJoin from "$/components/RequestToJoin"
import Auth from "$/components/Auth"
import MicTest from "./MicTest"
import Checks from "./Checks"

export default function StageStageIdPage() {
  const { stageId } = useParams() as { stageId: string }
  const {
    data: stage,
    error,
    isPending,
    isError
  } = useQuery({
    queryKey: ["stage", stageId.toUpperCase()],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("stages")
        .select("*")
        .eq("id", stageId.toUpperCase())
        .abortSignal(signal)
        .maybeSingle()
      if (error) throw new Error(error.message)
      return data
    }
  })

  const auth = useContext(AuthContext)

  if (!auth) {
    return (
      <div className="m-4 mt-10">
        <h1 className="mb-2 text-3xl font-bold">Not authenticated</h1>
        <p className="mb-2 text-xl">
          You must sign up / sign in before joining a stage.
        </p>
        <div className="max-w-sm">
          <Auth />
        </div>
      </div>
    )
  }

  const { data: isInvited, isPending: isInviteCheckPending } = useQuery({
    queryKey: ["stage", stageId.toUpperCase(), "isInvited"],
    enabled: stage?.invite_only && auth.user?.id !== stage.owner_id,
    queryFn: async ({ signal }) => {
      if (!auth.user) return false
      const { data } = await supabase
        .from("stage_invites")
        .select("id")
        .eq("stage_id", stage!.id)
        .eq("to_id", auth.user.id)
        .abortSignal(signal)
        .maybeSingle()
      return !!data?.id
    }
  })

  if (isPending || (stage?.invite_only && auth.user?.id !== stage.owner_id && isInviteCheckPending)) {
    return (
      <div className="m-4 mx-auto mt-20 max-w-sm">
        <Loader2 className="animate-spin duration-300" size={24} />
      </div>
    )
  }

  if (isError) {
    throw error
  }

  if (!stage) {
    throw new Error("404")
  }

  return (
    <div className="mx-4 my-4 grid max-w-screen-xl grid-cols-1 gap-6 md:mx-auto md:my-6 md:grid-cols-3 md:gap-4">
      <main className="col-span-1 md:col-span-2">
        <h1 className="mb-2 text-3xl font-bold">
          Joining stage{" "}
          <span className="text-gray-700 dark:text-gray-400">{stage.name}</span>
        </h1>
        <p className="mb-2 text-xl">
          Description:{" "}
          <code className="text-gray-700 dark:text-gray-400">{stage.description}</code>
        </p>
        <div className="flex items-center gap-2">
          {auth?.user?.id === stage.owner_id && <Badge>You are the owner</Badge>}
          {stage.invite_only && <Badge variant="destructive">Invite-Only</Badge>}
        </div>
        <div className="my-4">
          {stage.invite_only && auth?.user?.id !== stage.owner_id && !isInvited ? (
            <div className="max-w-screen-md">
              <RequestToJoin stageId={stageId} />
            </div>
          ) : (
            <Button size="lg" asChild>
              <button disabled>Join Stage</button>
            </Button>
          )}
        </div>
      </main>
      <aside className="max-w-sm">
        <Checks />
        <MicTest />
      </aside>
    </div>
  )
}
