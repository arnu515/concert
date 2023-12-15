import { useDisconnectButton } from "@livekit/components-react"
import { Button } from "../ui/button"
import { useIsLocalASpeaker } from "$/contexts/participants"

function LeaveStage() {
  const {
    buttonProps: { onClick, disabled }
  } = useDisconnectButton({})

  return (
    <Button variant="destructive" asChild>
      <button disabled={disabled} onClick={onClick}>
        Leave Stage
      </button>
    </Button>
  )
}

function AskToSpeak() {
  const isLocalASpeaker = useIsLocalASpeaker()
  if (isLocalASpeaker) return null

  return <Button>Ask to Speak</Button>
}

export default function Actions() {
  return (
    <div className="my-4 flex items-center gap-4">
      <AskToSpeak />
      <LeaveStage />
    </div>
  )
}
