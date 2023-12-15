import supabase from "$/util/supabase"
import { useMutation } from "@tanstack/react-query"
import { atom } from "nanostores"
import { FunctionsHttpError } from "@supabase/supabase-js"

export const tokenStore = atom<string | null>(null)

export const useGetToken = () =>
  useMutation<void, Error, { stageId: string }>({
    mutationFn: async ({ stageId }) => {
      const { data, error } = await supabase.functions.invoke("get-livekit-token", {
        body: { stageId },
        method: "POST"
      })
      if (error) {
        let message = error.message
        if (error instanceof FunctionsHttpError) {
          try {
            message = (await error.context.json()).message
          } catch { }
        }
        throw new Error(message)
      }
      if (!data.token)
        throw new Error(
          "Could not fetch token: " + data.message || "An unknown error occured"
        )
      tokenStore.set(data.token)
      return data
    }
  })
