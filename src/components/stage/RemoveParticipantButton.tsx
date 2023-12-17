import supabase from "$/util/supabase"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "$c/ui/use-toast"
import { FunctionsHttpError } from "@supabase/supabase-js"

export default function RemoveParticipantButton(pid: string) {
	const { toast } = useToast()
	const { mutate: remove, isPending } = useMutation({
		mutationFn: async () => {
			const { data, error } = await supabase.functions.invoke("remove-participant", {
				body: { pid },
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
		<button disabled={isPending} className="text-destructive" onClick={() => remove()}>
			Remove from Meeting
		</button>
	)
}
