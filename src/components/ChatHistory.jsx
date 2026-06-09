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
      <div className="mx-auto flex max-h-[45vh] w-full max-w-2xl flex-col gap-2 overflow-y-auto p-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md",
              m.sender === "user"
                ? "self-end rounded-br-sm bg-primary text-primary-foreground"
                : "self-start rounded-bl-sm bg-card text-card-foreground"
            )}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-card px-4 py-3 shadow-md">
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  )
}
