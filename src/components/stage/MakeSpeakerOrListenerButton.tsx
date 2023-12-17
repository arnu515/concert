import { useMutation } from "@tanstack/react-query"
import { useToast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"
import { useStore } from "@nanostores/react"
import { tokenStore } from "$/contexts/tokenStore"

export default function MakeSpeakerOrListenerButton({
	participantId,
	isSpeaker,
	stageId
}: {
	participantId: string
	isSpeaker: boolean
	stageId: string
}) {
	const { toast } = useToast()
	const token = useStore(tokenStore)
	const { mutate: make, isPending } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/stageOwner/make-speaker-or-listener", {
					body: JSON.stringify({ participantId, isSpeaker, stageId }),
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				})
				const data = await res.json()
				if (!res.ok) {
					toast({
						title: "Could not change permissions",
						description: data?.message || "An unknown error occured."
					})
				}
				toast({
					title: "Changed permissions",
					description: data.message
				})
			} catch (e) {
				console.error(e)
				toast({
					title: "Could not change permissions",
					description: (e as any)?.message || "An unknown error occured."
				})
			}
		}
	})

	return (
		<button
			disabled={isPending}
			className="flex items-center gap-1"
			onClick={() => make()}
		>
			{isPending && <Loader2 className="animate-spin" size={16} />}
			Make {isSpeaker ? "Listener" : "Speaker"}
		</button>
	)
}
