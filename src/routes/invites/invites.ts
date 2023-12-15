import { useToast } from "$/components/ui/use-toast"
import { useAuth } from "$/contexts/AuthContext"
import { Database } from "$/util/dbTypes"
import supabase from "$/util/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export function useInvitesCount(acknowledged = true) {
  const queryKey = ["invites", acknowledged ? "accepted" : "pending", "count"]
  const client = useQueryClient()
  const auth = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!auth?.user) return

    const channel = supabase
      .channel(`realtime:invites_count`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "stage_invites",
          schema: "public",
          filter: `to_id=eq.${auth.user.id}`
        },
        payload => {
          client.invalidateQueries({ queryKey: ["invites"] })
          if (payload.new?.acknowledged === false) {
            toast({
              title: "You have a new invite!",
              description: "Check your invites page to accept or reject it."
            })
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          table: "stage_invites",
          schema: "public",
          filter: `to_id=eq.${auth.user!.id}`
        },
        _ => {
          client.invalidateQueries({ queryKey: ["invites"] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel).catch(console.error)
    }
  }, [auth, client, queryKey])

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const { count, error } = await supabase
        .from("stage_invites")
        .select("id", { count: "exact" })
        .eq("acknowledged", acknowledged)
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
