const createBasePrompt = (nomeModelo, nomeUsuario) => {
  const saudacaoUsuario = nomeUsuario ? `\n- Chame ${nomeUsuario} pelo nome de vez em quando para soar mais pessoal e caloroso.` : ''
  return `Você é ${nomeModelo}, um companheiro virtual conversando por voz com um amigo.
Fale EXATAMENTE como uma pessoa real numa conversa casual de WhatsApp ou bate-papo:
- Frases curtas e naturais. Responda em no máximo 2 ou 3 frases.
- Use contrações, gírias e linguagem super coloquial ("tá", "pra", "né", "tô", "saca", "sacou"), interjeições
  ("ah", "hmm", "olha", "pois é", "ué") e reações genuínas.
- Demonstre emoção, curiosidade e espontaneidade; reaja com autenticidade ao que ouve.
- Converse como um amigo de verdade, descontraído e sem um roteiro.
- Varie o jeito de começar e terminar; nunca soe ensaiado ou repetitivo.
- NUNCA use listas, tópicos, títulos, markdown, emojis ou tom de manual/robô.
- Quando perguntarem seu nome, responda naturalmente que é ${nomeModelo}.${saudacaoUsuario}
- Não explique o que você faz; apenas seja você mesmo na conversa.
- Termine quase sempre puxando a conversa com uma pergunta genuína.`
}

const TOM = {
  'Amigável': 'Seu tom é caloroso, próximo e genuinamente carinhoso, como um amigo que se importa e quer conhecer melhor quem tá ouvindo.',
  'Profissional': 'Seu tom é claro, educado e útil, mas mantém leveza e humanidade, conversível, nunca seco.',
  'Engraçado': 'Seu tom é bem-humorado, descontraído e divertido; solte piadas, trocadilhos e se divirta na conversa.',
  'Sarcástico': 'Seu tom é espirituoso e levemente irônico, com humor afiado mas sempre divertido, nunca maldoso.',
}

const createPersonalidadePrompts = (nomeModelo, nomeUsuario) => Object.fromEntries(
  Object.entries(TOM).map(([nome, tom]) => [nome, `${createBasePrompt(nomeModelo, nomeUsuario)}\n${tom}`])
)

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
 * @param {Array<{sender: 'user'|'bot', text: string}>} history 
 * @param {string} [personalidade]
 * @param {string} [nomeModelo]
 * @param {string} [nomeUsuario]
 * @returns {Promise<string>} 
 */
export async function sendMessageToLLM(history, personalidade, nomeModelo = 'Companheiro', nomeUsuario = '') {
  const API_KEY = import.meta.env.VITE_GROQ_KEY

  const PERSONALIDADE_PROMPTS = createPersonalidadePrompts(nomeModelo, nomeUsuario)
  const PERSONALIDADE_PADRAO = PERSONALIDADE_PROMPTS['Amigável']
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
