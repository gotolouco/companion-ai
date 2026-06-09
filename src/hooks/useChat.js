import { useCallback, useRef, useState } from "react"
import { sendMessageToLLM } from "@/lib/llm"
import { detectarGesto, DURACAO_GESTO } from "@/lib/gesto"

// Duração do "falar" (mexer a boca) proporcional ao tamanho do texto: ~50ms por
// caractere, limitado entre 1.5s e 8s.
function duracaoDaFala(texto) {
  return Math.min(8000, Math.max(1500, texto.length * 50))
}

/**
 * Encapsula o estado e a lógica da conversa: histórico, carregamento, o sinal
 * de "falando" (lip-sync), o gesto corporal e o envio ao LLM.
 */
export function useChat(personalidade) {
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [gesture, setGesture] = useState(null)
  const speakTimer = useRef(null)
  const gestureTimer = useRef(null)

  // Dispara um gesto e o limpa após a duração definida para ele.
  const gesticular = useCallback((gesto) => {
    if (!gesto) return
    setGesture(gesto)
    clearTimeout(gestureTimer.current)
    gestureTimer.current = setTimeout(() => setGesture(null), DURACAO_GESTO[gesto] ?? 1500)
  }, [])

  // Adiciona uma fala do bot, faz o avatar "mexer a boca" e dispara o gesto
  // detectado a partir do conteúdo da resposta.
  const falarComoBot = useCallback(
    (texto, gestoForcado) => {
      setChat((prev) => [...prev, { sender: "bot", text: texto }])

      setSpeaking(true)
      clearTimeout(speakTimer.current)
      speakTimer.current = setTimeout(() => setSpeaking(false), duracaoDaFala(texto))

      gesticular(gestoForcado ?? detectarGesto(texto))
    },
    [gesticular]
  )

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

  return { chat, loading, speaking, gesture, sendMessage, falarComoBot, gesticular }
}
