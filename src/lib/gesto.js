

const AFIRMATIVAS = [
  "sim", "claro", "com certeza", "certamente", "exato", "isso", "isso mesmo",
  "perfeito", "pode deixar", "concordo", "verdade", "aham",
]

const NEGATIVAS = [
  "não", "nao", "nunca", "jamais", "de jeito nenhum", "negativo", "discordo",
]


export const DURACAO_GESTO = {
  nod: 1500,
  shake: 1500,
}

function normalizar(texto) {
  return texto.trim().toLowerCase()
}

/**
 * @param {string} texto 
 * @returns {'nod'|'shake'|null} 
 */
export function detectarGesto(texto) {
  if (!texto) return null
  const t = normalizar(texto)
  const contem = (lista) => lista.some((p) => t.includes(p))
  const comeca = (lista) => lista.some((p) => t.startsWith(p))

 
  if (comeca(NEGATIVAS) || contem(NEGATIVAS)) return "shake"
  if (comeca(AFIRMATIVAS) || contem(AFIRMATIVAS)) return "nod"
  return null
}
