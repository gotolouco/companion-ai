import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function ChatHistory({ messages, loading }) {
  const endRef = useRef(null)


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  if (messages.length === 0 && !loading) return null

  return (
    <div className="fixed bottom-20 left-14 right-0 z-10 mx-auto flex max-h-[45vh] w-[92%] max-w-2xl flex-col gap-2 overflow-y-auto p-1 sm:bottom-24 sm:w-4/5 md:left-16">
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
  )
}
