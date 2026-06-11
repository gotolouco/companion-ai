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
    <div className="fixed inset-x-0 bottom-3 z-10 px-3 sm:bottom-5 sm:pl-16 sm:pr-4">
      <form
        onSubmit={handleSubmit}
        className="chatbox-glass mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl p-2"
      >
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button type="submit" size="icon" className="shrink-0 rounded-xl">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
