import { Database } from "$/util/dbTypes"
import supabase from "$/util/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useAcceptedInvitesCount() {
  return useQuery({
    queryKey: ["invites", "accepted", "count"],
    queryFn: async ({ signal }) => {
      const { count, error } = await supabase
        .from("stage_invites")
        .select("id", { count: "exact" })
        .eq("acknowledged", true)
        .abortSignal(signal)
      if (error) throw new Error(error.message)
      return count
    }
  })
}

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("stage_invites")
        .select("*, stage:stages(*)")
        .eq("acknowledged", false)
        .abortSignal(signal)
      if (error) throw new Error(error.message)
      return data
    }
  })
}

export function useAcceptInvite() {
  const client = useQueryClient()

  return useMutation<
    void,
    Error,
    { inviteId: Database["public"]["Tables"]["stage_invites"]["Row"]["id"] }
  >({
    mutationFn: async ({ inviteId }) => {
      const { error } = await supabase
        .from("stage_invites")
        .update({ acknowledged: true })
        .eq("id", inviteId)
      if (error) throw new Error(error.message)
      client.invalidateQueries({ queryKey: ["invites"] })
    }
  })
}

export function useRejectInvite() {
  const client = useQueryClient()

  return useMutation<
    void,
    Error,
    { inviteId: Database["public"]["Tables"]["stage_invites"]["Row"]["id"] }
  >({
    mutationFn: async ({ inviteId }) => {
      const { error } = await supabase.from("stage_invites").delete().eq("id", inviteId)
      if (error) throw new Error(error.message)
      client.invalidateQueries({ queryKey: ["invites"] })
    }
  })
}
