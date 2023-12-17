import { useMutation } from "@tanstack/react-query"
import { useToast } from "../ui/use-toast"
import supabase from "$/util/supabase"
import { FunctionsHttpError } from "@supabase/supabase-js"

export default function MakeSpeakerOrListener({
	pid,
	isSpeaker
}: {
	pid: string
	isSpeaker: boolean
}) {
	const { toast } = useToast()
	const { mutate: make, isPending } = useMutation({
		mutationFn: async () => {
			const { data, error } = await supabase.functions.invoke("remove-participant", {
				body: { pid, isSpeaker },
				method: "POST"
			})
			if (error || !data?.success) {
				let description = error?.message || "An unknown error occured."
				if (error instanceof FunctionsHttpError) {
					try {
						description = (await error.context.json()).message
					} catch {}
				}
				toast({ title: "Could not remove participant", description })
			}
		}
	})

	return (
		<button disabled={isPending} onClick={() => make()}>
			Make {isSpeaker ? "Listener" : "Speaker"}
		</button>
	)
}
