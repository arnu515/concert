import {
  useAcceptJoinRequest,
  useJoinRequests,
  useRejectJoinRequest
} from "$/contexts/joinRequests"
import { useStageForRooms } from "$contexts/stageStore"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "../ui/skeleton"
import { Database } from "$/util/dbTypes"
import { fetchProfile } from "$/contexts/AuthContext"
import { Button } from "../ui/button"
import { Check, Loader2, X } from "lucide-react"

function JoinRequestItem({
  jr
}: {
  jr: Database["public"]["Tables"]["join_requests"]["Row"]
}) {
  const {
    isPending,
    isError,
    data: profile
  } = useQuery({
    queryKey: ["profile", jr.from_id],
    queryFn: ({ queryKey }) => fetchProfile(queryKey[1])
  })
  const { mutate: acceptJoinRequest, isPending: isAcceptPending } =
    useAcceptJoinRequest()
  const { mutate: rejectJoinRequest, isPending: isRejectPending } =
    useRejectJoinRequest()

  if (isPending || isError) return null

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium underline">{profile.username}</span>
      <div className="ml-auto flex items-center gap-1">
        <Button size="icon" asChild>
          <button
            title="Accept"
            aria-label="Accept invite"
            disabled={isAcceptPending}
            onClick={() => acceptJoinRequest({ joinRequestId: jr.id })}
          >
            {isAcceptPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
          </button>
        </Button>
        <Button size="icon" variant="destructive" asChild>
          <button
            title="Reject"
            aria-label="Reject invite"
            onClick={() => rejectJoinRequest({ joinRequestId: jr.id })}
          >
            {isRejectPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <X size={16} />
            )}
          </button>
        </Button>
      </div>
    </div>
  )
}

function JoinRequestsContent() {
  const {
    data: stage,
    isPending: isStagePending,
    isError: isStageError,
    error: stageError
  } = useStageForRooms()
  const {
    data: joinRequests,
    isPending: isJoinRequestsPending,
    isError: isJoinRequestsError,
    error: joinRequestsError
  } = useJoinRequests(stage!.id, !!stage)

  if (isStageError || isJoinRequestsError)
    return (
      <p>
        {stageError?.message ||
          joinRequestsError?.message ||
          "An unkown error occured."}
      </p>
    )
  if (isStagePending || isJoinRequestsPending)
    return <Skeleton className="h-8 w-full" />

  return (
    <div className="flex flex-col gap-2">
      {joinRequests.map(jr => (
        <JoinRequestItem key={jr.id} jr={jr} />
      ))}
    </div>
  )
}

export default function JoinRequests() {
  return (
    <div className="flex flex-col justify-center rounded-md border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800">
      <h3 className="text-2xl font-semibold">Join requests</h3>
      <JoinRequestsContent />
    </div>
  )
}
