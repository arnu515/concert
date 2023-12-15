import { SendHorizonal } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useChat } from "@livekit/components-react"
import type { Database } from "$/util/dbTypes"
import Avatar from "../Avatar"
import { useEffect, useRef } from "react"

export default function Chat() {
  const { send, chatMessages, isSending } = useChat()
  const messagesBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesBoxRef.current?.scrollTo({
      top: messagesBoxRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [chatMessages])

  return (
    <div className="flex h-[512px] flex-col justify-center rounded-md border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800">
      <h3 className="text-2xl font-semibold">Stage Chat</h3>

      <div className="m-4 overflow-x-hidden" ref={messagesBoxRef}>
        {chatMessages.length > 0 ? (
          chatMessages.map(({ from, message, timestamp }, index) => {
            if (from) {
              const { profile } = JSON.parse(from.metadata!) as {
                profile: Database["public"]["Tables"]["profiles"]["Row"]
              }

              return (
                <div key={timestamp} className="my-1 flex flex-col">
                  {chatMessages[index - 1]?.from?.identity !== from.identity && (
                    <div className="flex items-center gap-2">
                      <Avatar
                        h="1rem"
                        w="1rem"
                        src={profile.avatar_url}
                        alt={`${profile.username}'s avatar`}
                      />
                      <span className="text-gray-500">{profile.username}</span>
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-400">{message}</p>
                </div>
              )
            } else {
              return <p className="text-center">{message}</p>
            }
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
      </div>

      <form
        className="mt-auto flex items-center gap-2"
        onSubmit={e => {
          const form = e.target as HTMLFormElement
          e.preventDefault()
          const message = new FormData(form).get("message") || ""
          if (typeof message !== "string" || !message.trim()) return
          send?.(message)
          form.reset()
        }}
      >
        <Input placeholder="Enter a message" aria-label="Message" name="message" />
        <Button size="icon" asChild>
          <button
            type="submit"
            disabled={isSending}
            title="Send message"
            aria-label="Send message"
          >
            <SendHorizonal size={16} />
          </button>
        </Button>
      </form>
    </div>
  )
}
