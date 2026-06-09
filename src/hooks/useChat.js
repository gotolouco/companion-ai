import { useCallback, useRef, useState } from "react"
import { sendMessageToLLM } from "@/lib/llm"

// Duração do "falar" (mexer a boca) proporcional ao tamanho do texto: ~50ms por
// caractere, limitado entre 1.5s e 8s.
function duracaoDaFala(texto) {
  return Math.min(8000, Math.max(1500, texto.length * 50))
}

/**
 * Encapsula o estado e a lógica da conversa: histórico, carregamento, o sinal
 * de "falando" (para o lip-sync) e o envio de mensagens ao LLM.
 */
export function useChat(personalidade) {
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const speakTimer = useRef(null)

  // Adiciona uma fala do bot e o faz "mexer a boca" pela duração proporcional.
  const falarComoBot = useCallback((texto) => {
    setChat((prev) => [...prev, { sender: "bot", text: texto }])
    setSpeaking(true)
    clearTimeout(speakTimer.current)
    speakTimer.current = setTimeout(() => setSpeaking(false), duracaoDaFala(texto))
  }, [])

  const sendMessage = useCallback(
    async (msg) => {
      const updatedChat = [...chat, { sender: "user", text: msg }]
      setChat(updatedChat)
      setLoading(true)
      try {
        const resposta = await sendMessageToLLM(updatedChat, personalidade)
        falarComoBot(resposta)
      } finally {
        setLoading(false)
      }
    },
    [chat, personalidade, falarComoBot]
  )

  return { chat, loading, speaking, sendMessage, falarComoBot }
}
