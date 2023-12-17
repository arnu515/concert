import { useMutation } from "@tanstack/react-query"
import { useToast } from "$c/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useStore } from "@nanostores/react"
import { tokenStore } from "$/contexts/tokenStore"

export default function RemoveParticipantButton({
	participantId,
	stageId
}: {
	participantId: string
	stageId: string
}) {
	const { toast } = useToast()
	const token = useStore(tokenStore)
	const { mutate: remove, isPending } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/stageOwner/remove-participant", {
					body: JSON.stringify({ participantId, stageId }),
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				})
				const data = await res.json()
				if (!res.ok) {
					toast({
						title: "Could not remove participant",
						description: data?.message || "An unknown error occured."
					})
				}
				toast({
					title: "Removed participant",
					description: data.message
				})
			} catch (e) {
				console.error(e)
				toast({
					title: "Could not remove participant",
					description: (e as any)?.message || "An unknown error occured."
				})
			}
		}
	})

	return (
		<button
			disabled={isPending}
			className="flex items-center gap-1 text-destructive"
			onClick={() => remove()}
		>
			{isPending && <Loader2 className="animate-spin" size={16} />}
			Remove from Meeting
		</button>
	)
}
