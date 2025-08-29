export async function sendMessageToLLM(message) {

    const API_KEY = "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"

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "appli  cation/json",
        "Authorization":`Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: message }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "Resposta vazia."
  } catch (error) {
    console.error("Erro ao chamar LLM:", error)
    return "Ops! Não consegui gerar uma resposta agora."
  }
}
