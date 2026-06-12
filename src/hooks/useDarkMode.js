import { useEffect, useState } from "react"

const CHAVE = "companion-theme"


function preferenciaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo) return salvo === "dark"
  } catch {
    return false
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
}

/**
 * @returns {[boolean, () => void]}
 */
export function useDarkMode() {
  const [dark, setDark] = useState(preferenciaInicial)

  useEffect(() => {
    const raiz = document.documentElement
    raiz.classList.toggle("dark", dark)
    try {
      localStorage.setItem(CHAVE, dark ? "dark" : "light")
    } catch {
      void 0 
    }
  }, [dark])

  const toggle = () => setDark((v) => !v)
  return [dark, toggle]
}
