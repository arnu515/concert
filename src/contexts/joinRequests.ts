import { Database } from "$/util/dbTypes"
import supabase from "$/util/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useAuth } from "./AuthContext"

export function useJoinRequests(stageId: string, enabled = true) {
  const client = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:stage:${stageId}:join_requests`)
      .on(
        "postgres_changes",
        {
          event: "*",
          table: "join_requests",
          schema: "public",
          filter: `stage_id=eq.${stageId}`
        },
        _ => {
          client.invalidateQueries({ queryKey: ["stage", stageId, "join_requests"] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel).catch(console.error)
    }
  }, [client])

  return useQuery({
    queryKey: ["stage", stageId, "join_requests"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .eq("stage_id", stageId)
        .abortSignal(signal)
      if (error) throw new Error(error.message)
      return data
    },
    enabled
  })
}

export function useAcceptJoinRequest() {
  const client = useQueryClient()
  const auth = useAuth()

  return useMutation<
    void,
    Error,
    { joinRequestId: Database["public"]["Tables"]["join_requests"]["Row"]["id"] }
  >({
    mutationFn: async ({ joinRequestId }) => {
      if (!auth?.user) throw new Error("Unauthorized")
      const { error: joinRequestDeleteError, data: joinRequest } = await supabase
        .from("join_requests")
        .delete()
        .eq("id", joinRequestId)
        .select()
        .maybeSingle()
      if (joinRequestDeleteError) throw new Error(joinRequestDeleteError.message)
      if (!joinRequest)
        throw new Error(
          "This join request does not exist, or you're not allowed to accept it."
        )

      const { error } = await supabase.from("stage_invites").insert({
        from_id: auth.user.id,
        to_id: joinRequest.from_id,
        stage_id: joinRequest.stage_id
      })

      if (error) throw new Error(error.message)
      client.invalidateQueries({
        queryKey: ["stage", joinRequest.stage_id, "join_requests"]
      })
    }
  })
}

export function useRejectJoinRequest() {
  const client = useQueryClient()

  return useMutation<
    void,
    Error,
    { joinRequestId: Database["public"]["Tables"]["join_requests"]["Row"]["id"] }
  >({
    mutationFn: async ({ joinRequestId }) => {
      const { error: joinRequestDeleteError, data: joinRequest } = await supabase
        .from("join_requests")
        .delete()
        .eq("id", joinRequestId)
        .select()
        .maybeSingle()
      if (joinRequestDeleteError) throw new Error(joinRequestDeleteError.message)
      if (!joinRequest)
        throw new Error(
          "This join request does not exist, or you're not allowed to accept it."
        )
      client.invalidateQueries({
        queryKey: ["stage", joinRequest.stage_id, "join_requests"]
      })
    }
  })
}
