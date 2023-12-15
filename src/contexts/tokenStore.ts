import supabase from "$/util/supabase"
import { useMutation } from "@tanstack/react-query"
import { atom } from "nanostores"
import { FunctionsHttpError } from "@supabase/supabase-js"

export const tokenStore = atom<string | null>(
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUElIREE5WVFMNExCWWsiLCJzdWIiOiI0MzVjNjdjZS05ODMxLTQ1MWItYTFmZS05YTJhNjlhMDQwZjUiLCJtZXRhZGF0YSI6IntcInByb2ZpbGVcIjp7XCJpZFwiOlwiNDM1YzY3Y2UtOTgzMS00NTFiLWExZmUtOWEyYTY5YTA0MGY1XCIsXCJ1c2VybmFtZVwiOlwiYXJudTUxNTJcIixcImF2YXRhcl91cmxcIjpcImh0dHBzOi8vZ3JhdmF0YXIuY29tL2F2YXRhci83YmEzOGI5MTQxYTZhZWEzNDk0NzkzZTk1YWI2MWQ2Ny5qcGc_ZD1odHRwcyUzQSUyRiUyRmFwaS5kaWNlYmVhci5jb20lMkY3LnglMkZpbml0aWFscyUyRnN2ZyUzRnNlZWQlM0Rhcm51NTE1MkBnbWFpbC5jb20lMjZiYWNrZ3JvdW5kVHlwZSUzRGdyYWRpZW50TGluZWFyXCIsXCJ3ZWJzaXRlXCI6bnVsbH19IiwibmFtZSI6ImFybnU1MTUyIiwidmlkZW8iOnsicm9vbUpvaW4iOnRydWUsInJvb20iOiJzdGFnZS1ZTU9ZMVlJSVUiLCJyb29tQWRtaW4iOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuUHVibGlzaFNvdXJjZXMiOlsibWljcm9waG9uZSJdLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZX0sIm5iZiI6MTcwMjY0MjM3MSwiZXhwIjoxNzAyNjg1NTcxfQ.uePeIyR5xhQi9rbV7eZJAfu3HerwJkAhBRF7HjmMqMQ"
)

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
