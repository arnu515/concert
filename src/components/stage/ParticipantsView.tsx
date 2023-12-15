import { useLocalParticipant } from "@livekit/components-react"
import { LocalParticipant, RemoteParticipant } from "livekit-client"
import Avatar from "../Avatar"
import { Database } from "$/util/dbTypes"
import { Badge } from "$c/ui/badge"
import { useIsLocalASpeaker, useListeners, useSpeakers } from "$/contexts/participants"

export function ParticipantTile({
  p,
  isOwner
}: {
  p: LocalParticipant | RemoteParticipant
  isOwner: boolean
}) {
  const { profile } = JSON.parse(p.metadata!) as {
    profile: Database["public"]["Tables"]["profiles"]["Row"]
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <Avatar
        src={profile.avatar_url}
        alt={`${profile.username}'s avatar`}
        h="4rem"
        w="4rem"
        fb={profile.username.charAt(0)}
      />
      <p className="font-medium">{profile.username}</p>
      {isOwner && (
        <div className="text-sm">
          <Badge>Owner</Badge>
        </div>
      )}
    </div>
  )
}

export default function ParticipantsView({ stageOwnerId }: { stageOwnerId: string }) {
  const { localParticipant } = useLocalParticipant()
  const isLocalASpeaker = useIsLocalASpeaker()
  const speakers = useSpeakers()
  const listeners = useListeners()

  return (
    <div className="rounded-md border border-gray-700 bg-gray-100 px-4 py-6 dark:border-gray-300 dark:bg-gray-800">
      <h3 className="text-2xl font-semibold">Speakers</h3>
      <div className="grid grid-cols-2 items-center gap-x-2 gap-y-4 md:grid-cols-4 lg:grid-cols-6">
        {isLocalASpeaker && (
          <ParticipantTile
            p={localParticipant}
            isOwner={stageOwnerId === localParticipant.identity}
          />
        )}
        {speakers.map(r => (
          <ParticipantTile
            p={r}
            key={r.identity}
            isOwner={stageOwnerId === r.identity}
          />
        ))}
      </div>
      <h3 className="text-2xl font-semibold">Listeners</h3>
      <div className="grid grid-cols-2 items-center gap-x-2 gap-y-4 md:grid-cols-4 lg:grid-cols-6">
        {!isLocalASpeaker && (
          <ParticipantTile
            p={localParticipant}
            isOwner={stageOwnerId === localParticipant.identity}
          />
        )}
        {listeners.map(r => (
          <ParticipantTile
            p={r}
            key={r.identity}
            isOwner={stageOwnerId === r.identity}
          />
        ))}
      </div>
    </div>
  )
}
