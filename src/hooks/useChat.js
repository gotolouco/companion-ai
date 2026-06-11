import { useCallback, useRef, useState } from "react";
import { sendMessageToLLM } from "@/lib/llm";

function duracaoDaFala(texto) {
  return Math.min(8000, Math.max(1500, texto.length * 50));
}

export function useChat(personalidade) {
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState("");
  const speakTimer = useRef(null);

  const falarComoBot = useCallback((texto) => {
    setChat((prev) => [...prev, { sender: "bot", text: texto }]);
    setSpeaking(true);
    setLastBotMessage(texto);
    clearTimeout(speakTimer.current);
    speakTimer.current = setTimeout(() => {
      setSpeaking(false);
      setLastBotMessage("");
    }, duracaoDaFala(texto));
  }, []);

  const sendMessage = useCallback(
    async (msg) => {
      const updatedChat = [...chat, { sender: "user", text: msg }];
      setChat(updatedChat);
      setLoading(true);
      try {
        const resposta = await sendMessageToLLM(updatedChat, personalidade);
        falarComoBot(resposta);
      } finally {
        setLoading(false);
      }
    },
    [chat, personalidade, falarComoBot]
  );

  return { chat, loading, speaking, sendMessage, falarComoBot, lastBotMessage };
}