import { Database } from "$/util/dbTypes"
import { LiveKitRoom, useConnectionState } from "@livekit/components-react"
import { useToast } from "../ui/use-toast"
import { ConnectionState, MediaDeviceFailure } from "livekit-client"
import { Loader2 } from "lucide-react"
import type { PropsWithChildren } from "react"
import { tokenStore } from "$/contexts/tokenStore"
import StageView from "./StageView"

interface Props {
  token: string
  stage: Database["public"]["Tables"]["stages"]["Row"]
}

export function ConnectingStatus() {
  return (
    <div className="m-4 flex items-center gap-2">
      <Loader2 className="animate-spin duration-300" size={24} />
      <p className="text-gray-700 dark:text-gray-400">Connecting...</p>
    </div>
  )
}

export function CheckConnection({ children }: PropsWithChildren) {
  const state = useConnectionState()

  if (state === ConnectionState.Connecting) return <ConnectingStatus />
  if (state === ConnectionState.Disconnected)
    return <p>Disconnected. Please refresh this page.</p>

  if (state === ConnectionState.Connected || state === ConnectionState.Reconnecting)
    return children
}

export default function Stage({ token, stage }: Props) {
  const { toast } = useToast()

  return (
    <LiveKitRoom
      serverUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
      token={token}
      connect={true}
      connectOptions={{
        maxRetries: 3
      }}
      onConnected={() => {
        toast({
          title: "Connected to stage",
          description: "You have been connected to the stage " + stage.name
        })
      }}
      onDisconnected={() => {
        toast({
          title: "Disconnected from stage",
          description: "You have been disconnected from the stage " + stage.name
        })
        tokenStore.set(null)
      }}
      onError={err => {
        toast({
          title: "An error occured",
          description: err.message,
          variant: "destructive"
        })
      }}
      onMediaDeviceFailure={failure => {
        let description = "Could not get access to your microphone."
        switch (failure) {
          case MediaDeviceFailure.NotFound:
            description = "Could not find a microphone."
            break
          case MediaDeviceFailure.PermissionDenied:
            description = "You denied access to your microphone."
            break
          case MediaDeviceFailure.DeviceInUse:
            description = "Your microphone is in use by another browser tab."
            break
          default:
            break
        }
        toast({ title: "Media device failure", description, variant: "destructive" })
      }}
    >
      <CheckConnection>
        <StageView />
      </CheckConnection>
    </LiveKitRoom>
  )
}
