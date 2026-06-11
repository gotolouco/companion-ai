const CHAVE_VISITA = "companion-last-visit"


function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}


function periodoDoDia(hora) {
  if (hora < 6) return "madrugada"
  if (hora < 12) return "manha"
  if (hora < 18) return "tarde"
  return "noite"
}

const CUMPRIMENTOS = {
  madrugada: ["Boa madrugada", "Ainda acordado(a) a essa hora? Boa madrugada"],
  manha: ["Bom dia", "Bom diaa"],
  tarde: ["Boa tarde", "Boa tardee"],
  noite: ["Boa noite", "Boa noitee"],
}


const VOLTAS = {
  pouco: ["", ""], 
  medio: ["Quanto tempo, hein!", "Senti sua falta!", "Demorou pra voltar, viu?"],
  muito: ["Nossa, sumiu! Que saudade!", "Faz tempão que você não aparece!", "Achei que tinha me esquecido!"],
}


function faixaAusencia(ms) {
  if (ms == null) return "pouco"
  const horas = ms / 3_600_000
  if (horas >= 24) return "muito"
  if (horas >= 3) return "medio"
  return "pouco"
}

/**
 * @param {object} opts
 * @param {string} [opts.nomeUsuario] 
 * @param {string} [opts.nomeModelo] 
 * @param {Date} agora 
 * @returns {string}
 */
export function montarSaudacao({ nomeUsuario = "", nomeModelo = "" } = {}, agora) {
  const data = agora instanceof Date ? agora : new Date()
  const hora = data.getHours()

  let ultimaVisita = null
  try {
    const salvo = localStorage.getItem(CHAVE_VISITA)
    if (salvo) ultimaVisita = data.getTime() - Number(salvo)
    localStorage.setItem(CHAVE_VISITA, String(data.getTime()))
  } catch {
    ultimaVisita = null 
  }

  const cumprimento = aleatorio(CUMPRIMENTOS[periodoDoDia(hora)])
  const volta = aleatorio(VOLTAS[faixaAusencia(ultimaVisita)])
  const alvo = nomeUsuario ? `, ${nomeUsuario}` : ""

  const aberturas = nomeModelo
    ? [`${cumprimento}${alvo}! Eu sou ${nomeModelo}.`, `${cumprimento}${alvo}! ${nomeModelo} aqui.`]
    : [`${cumprimento}${alvo}!`]

  const fechos = ["Como você tá?", "Tudo bem por aí?", "No que tá pensando hoje?", "Conta como foi seu dia?"]

  return [aleatorio(aberturas), volta, aleatorio(fechos)]
    .filter(Boolean)
    .join(" ")
}
