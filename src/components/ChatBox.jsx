import { useState } from 'react'
import '../index.css' // garante que os estilos globais sejam aplicados

export default function ChatBox({ onSend }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    onSend(message)
    setMessage("")
  }

  return (
    <form className="chat-box" onSubmit={handleSubmit}>
      <input 
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button type="submit">Enviar</button>
    </form>
  )
}
