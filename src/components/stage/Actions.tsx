import { useDisconnectButton, useLocalParticipant } from "@livekit/components-react"
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

function MuteUnmute() {
	const isLocalASpeaker = useIsLocalASpeaker()
	const { isMicrophoneEnabled, localParticipant } = useLocalParticipant()
	if (!isLocalASpeaker) return null

	return (
		<Button
			onClick={() => {
				localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
			}}
		>
			{isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
		</Button>
	)
}

export default function Actions() {
	return (
		<div className="my-4 flex items-center gap-4">
			<MuteUnmute />
			<LeaveStage />
		</div>
	)
}
