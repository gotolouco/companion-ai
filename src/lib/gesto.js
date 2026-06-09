// Detecta, a partir da resposta do bot, um gesto de cabeça a ser exibido:
// 'nod' (acenar sim) ou 'shake' (negar não).

const AFIRMATIVAS = [
  "sim", "claro", "com certeza", "certamente", "exato", "isso", "isso mesmo",
  "perfeito", "pode deixar", "concordo", "verdade", "aham",
]

const NEGATIVAS = [
  "não", "nao", "nunca", "jamais", "de jeito nenhum", "negativo", "discordo",
]

// Duração (ms) de cada gesto de cabeça.
export const DURACAO_GESTO = {
  nod: 1500,
  shake: 1500,
}

function normalizar(texto) {
  return texto.trim().toLowerCase()
}

/**
 * @param {string} texto - resposta do bot
 * @returns {'nod'|'shake'|null} gesto sugerido
 */
export function detectarGesto(texto) {
  if (!texto) return null
  const t = normalizar(texto)
  const contem = (lista) => lista.some((p) => t.includes(p))
  const comeca = (lista) => lista.some((p) => t.startsWith(p))

  // Negativa tem prioridade (ex.: "não, claro que não").
  if (comeca(NEGATIVAS) || contem(" não ") || contem(" nao ")) return "shake"
  if (comeca(AFIRMATIVAS) || contem(" sim ") || contem(" sim,") || contem(" sim.")) return "nod"
  return null
}
