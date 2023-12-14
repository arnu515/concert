import { useQuery } from "@tanstack/react-query"
import { Database } from "$/util/dbTypes"
import { Badge } from "./ui/badge"
import { AuthContext, fetchProfile } from "$contexts/AuthContext"
import Avatar from "./Avatar"
import { Skeleton } from "./ui/skeleton"
import { cn } from "$/util/ui"
import { useContext } from "react"

interface Props {
  stage: Database["public"]["Tables"]["stages"]["Row"]
  className?: string
}

export function Owner({ ownerId }: { ownerId: string }) {
  const {
    isPending,
    isError,
    data: profile
  } = useQuery({
    queryKey: ["profile", ownerId],
    queryFn: ({ queryKey }) => fetchProfile(queryKey[1])
  })

  if (isError) return <span className="text-red-500">Could not fetch owner</span>
  if (isPending) return <OwnerLoading />

  return (
    <div className="flex items-center gap-2">
      By:
      <Avatar
        h="1rem"
        w="1rem"
        src={profile.avatar_url}
        alt={`${profile.username}'s avatar`}
      />
      <span className="text-sm text-gray-700 dark:text-gray-400">
        {profile.username}
      </span>
    </div>
  )
}

export function OwnerLoading() {
  return (
    <div className="flex items-center gap-2">
      By:
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  )
}

export default function StageCard({ stage, className }: Props) {
  const auth = useContext(AuthContext)

  return (
    <article
      className={cn(
        "flex flex-col justify-center rounded-md border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">{stage.name}</h3>
        <div className="flex gap-2">
          {stage.invite_only && (
            <Badge variant="destructive" className="hover:bg-destructive">
              Invite-Only
            </Badge>
          )}
          {stage.owner_id === auth?.user?.id && (
            <Badge className="hover:bg-primary">Your stage</Badge>
          )}
        </div>
      </div>
      <Owner ownerId={stage.owner_id} />
      {stage.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300">{stage.description}</p>
      )}
    </article>
  )
}
