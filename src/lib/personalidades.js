export const PERSONALIDADES = ["Amigável", "Profissional", "Engraçado", "Sarcástico"]
export const PERSONALIDADE_PADRAO = PERSONALIDADES[0]

const RESPOSTAS_ROSTO = {
  "Amigável": [
    "Ei, cuidado! Haha",
    "Opa, meu rosto é sensível!",
    "Ahahah, cuidado comigo!"
  ],
  "Profissional": [
    "Por favor, observe o limite pessoal.",
    "Isso não é apropriado.",
    "Mantenha a distância, obrigado."
  ],
  "Engraçado": [
    "Ué, tá me batendo?",
    "Ei! Que violência!",
    "Meu rosto é arte! Cuidado aí!"
  ],
  "Sarcástico": [
    "Que legal, agressão. Excelente fim de semana.",
    "Adorei que tocou no meu rosto. Não.",
    "Parabéns, você descobriu meu ponto fraco: eu sou sensível."
  ]
}

export function gerarRespostaRosto(personalidade) {
  const respostas = RESPOSTAS_ROSTO[personalidade] || RESPOSTAS_ROSTO[PERSONALIDADE_PADRAO]
  return respostas[Math.floor(Math.random() * respostas.length)]
}
