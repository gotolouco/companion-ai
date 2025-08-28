import { useState } from "react"
import '../index.css'

export default function SidePanel() {

  const [visible, setVisible] = useState(false)

  return (
    <>
      <div className={`side-panel ${visible ? 'visible' : 'hidden'}`}>
        <h2>Configurações</h2>
        <button>Avatar</button>
        <button>Personalidade</button>
        <button>Configurar Reações</button>
        <button>Salvar Configurações</button>
      </div>
      <button 
        className="toggle-button" 
        onClick={() => setVisible(!visible)}
      >
        {visible ? '−' : '+'}
      </button>
    </>
  )
}
