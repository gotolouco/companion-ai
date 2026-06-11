import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function ChatHistory({ messages, loading }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  if (messages.length === 0 && !loading) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-10 px-3 sm:bottom-24 sm:pl-16 sm:pr-4">
      <div className="chat-fade relative mx-auto flex max-h-[45vh] w-full max-w-2xl flex-col gap-2 overflow-y-auto rounded-2xl p-1 scrollbar-hide">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              m.sender === "user"
                ? "bubble-user self-end rounded-br-sm"
                : "bubble-bot self-start rounded-bl-sm"
            )}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="bubble-bot flex items-center gap-1 self-start rounded-2xl rounded-bl-sm px-4 py-3">
            <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  )
}
