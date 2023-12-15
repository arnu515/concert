import {
  useLocalParticipantPermissions,
  useRemoteParticipants
} from "@livekit/components-react"

export function useSpeakers() {
  const remoteParticipants = useRemoteParticipants()

  return remoteParticipants.filter(p => p.permissions?.canPublishSources?.includes(2))
}

export function useListeners() {
  const remoteParticipants = useRemoteParticipants()

  return remoteParticipants.filter(p => !p.permissions?.canPublishSources?.includes(2))
}

export function useIsLocalASpeaker() {
  const permissions = useLocalParticipantPermissions()
  return permissions?.canPublishSources?.includes(2)
}
