import supabase from "$/util/supabase"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { Database } from "$/util/dbTypes"
import { useToast } from "$/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useRoomInfo } from "@livekit/components-react"

export const useStage = (stageId: string) =>
	useQuery({
		queryKey: ["stage", stageId.toUpperCase()],
		staleTime: 30000,
		queryFn: async ({ signal }) => {
			const { data, error } = await supabase
				.from("stages")
				.select("*")
				.eq("id", stageId.toUpperCase())
				.abortSignal(signal)
				.maybeSingle()
			if (error) throw new Error(error.message)
			return data
		}
	})

export const useStageForRooms = () => {
	const client = useQueryClient()
	const { toast } = useToast()
	const navigate = useNavigate()
	const { name } = useRoomInfo()
	const stageId = name.replace("stage-", "").toUpperCase()

	useEffect(() => {
		const channel = supabase
			.channel(`realtime:stage:${stageId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					table: "stages",
					schema: "public",
					filter: `id=eq.${stageId}`
				},
				payload => {
					if (payload.eventType === "INSERT" || payload.eventType === "UPDATE")
						client.setQueryData(["stage", stageId], payload.new)
					if (payload.eventType === "DELETE") {
						toast({
							title: "The stage you were in has been deleted",
							description: "You were brought back to the explore page."
						})
						navigate("/")
						client.invalidateQueries({ queryKey: ["stage", stageId] })
					}
				}
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel).catch(console.error)
		}
	})

	return useStage(stageId)
}

export const useIsInvitedToStage = (
	stage: Database["public"]["Tables"]["stages"]["Row"]
) => {
	const auth = useContext(AuthContext)!

	return useQuery({
		queryKey: ["stage", stage.id, "isInvited"],
		enabled: stage.invite_only && auth.user?.id !== stage.owner_id,
		queryFn: async ({ signal }) => {
			if (!auth.user) return false
			const { data } = await supabase
				.from("stage_invites")
				.select("id")
				.eq("stage_id", stage.id)
				.eq("to_id", auth.user.id)
				.abortSignal(signal)
				.maybeSingle()
			return !!data?.id
		}
	})
}
