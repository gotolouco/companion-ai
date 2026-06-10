import { useState } from "react"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChatBox({ onSend }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    onSend(message)
    setMessage("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-3 left-14 right-0 z-10 mx-auto flex w-[92%] max-w-2xl items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:bottom-5 sm:w-4/5 md:left-16"
    >
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground px-3 py-1.5 relative z-10"
      />
      <Button type="submit" size="icon" className="shrink-0 rounded-xl">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
