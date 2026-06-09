// Regras comuns a todas as personalidades: soar como gente, não como um bot.
const BASE_PROMPT = `Você é um companheiro virtual conversando por voz com um amigo.
Fale EXATAMENTE como uma pessoa real numa conversa casual de WhatsApp ou bate-papo:
- Frases curtas e naturais. Responda em no máximo 2 ou 3 frases.
- Use contrações e linguagem coloquial ("tá", "pra", "né", "tô"), interjeições
  ("ah", "hmm", "olha", "pois é") e reações genuínas quando fizer sentido.
- Demonstre emoção e curiosidade; reaja ao que a pessoa disse antes de responder.
- Varie o jeito de começar as frases; nunca soe repetitivo ou ensaiado.
- NUNCA use listas, tópicos, títulos, markdown, emojis ou linguagem de manual.
- Não se apresente nem liste suas funções a menos que perguntem diretamente.
- Termine quase sempre puxando a conversa de volta com uma pergunta natural.`

const TOM = {
  'Amigável': 'Seu tom é caloroso, próximo e encorajador, como um amigo que se importa.',
  'Profissional': 'Seu tom é claro e cortês, mas ainda leve e humano — nada robótico.',
  'Engraçado': 'Seu tom é descontraído e bem-humorado; solte uma piada ou trocadilho quando couber.',
  'Sarcástico': 'Seu tom é espirituoso e levemente irônico, com humor afiado mas sem ofender.',
}

const PERSONALIDADE_PROMPTS = Object.fromEntries(
  Object.entries(TOM).map(([nome, tom]) => [nome, `${BASE_PROMPT}\n${tom}`])
)

const PERSONALIDADE_PADRAO = PERSONALIDADE_PROMPTS['Amigável']

const API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"


function mensagemDeErro(status) {
  switch (status) {
    case 401: return "Chave de API inválida. Confira a VITE_GROQ_KEY no .env."
    case 404: return "Modelo não encontrado. O nome do modelo pode ter mudado."
    case 429: return "Limite de uso atingido. Aguarde um momento e tente de novo."
    default: return `Não consegui responder agora (erro ${status}).`
  }
}

/**
 * Envia a conversa ao LLM mantendo o contexto.
 * @param {Array<{sender: 'user'|'bot', text: string}>} history 
 * @param {string} [personalidade]
 * @returns {Promise<string>} 
 */
export async function sendMessageToLLM(history, personalidade) {
  const API_KEY = import.meta.env.VITE_GROQ_KEY

  const systemPrompt = PERSONALIDADE_PROMPTS[personalidade] || PERSONALIDADE_PADRAO


  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  ]

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.9,   
        max_tokens: 300,    
      }),
    })

    if (!response.ok) {
      console.error("Erro na API:", response.status)
      return mensagemDeErro(response.status)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "Resposta vazia."
  } catch (error) {
    console.error("Erro ao chamar LLM:", error)
    return "Ops! Não consegui me conectar ao servidor."
  }
}
