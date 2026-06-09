import { useState } from 'react'
import ThreeViewer from './components/ThreeViewer'
import ChatBox from './components/ChatBox'
import ChatHistory from './components/ChatHistory'
import SidePanel from './components/SidePanel'
import { useChat } from '@/hooks/useChat'
import { MODELOS } from '@/lib/models'
import { PERSONALIDADE_PADRAO } from '@/lib/personalidades'
import './index.css'

// Saudação que o avatar fala ao ser selecionado, usando o nome do modelo.
function saudacaoDoModelo(file) {
  const nome = MODELOS.find((m) => m.file === file)?.label || 'seu companheiro'
  return `Oi! Eu sou ${nome}. Prazer em te conhecer — como você está?`
}

export default function App() {
  const [personalidade, setPersonalidade] = useState(PERSONALIDADE_PADRAO)
  const [avatar, setAvatar] = useState(MODELOS[0]?.file)
  const [armAngle, setArmAngle] = useState(1.35)

  const { chat, loading, speaking, sendMessage, falarComoBot } = useChat(personalidade)

  // Ao trocar de modelo, o novo avatar se apresenta dizendo o próprio nome.
  const trocarAvatar = (file) => {
    setAvatar(file)
    falarComoBot(saudacaoDoModelo(file))
  }

  return (
    <div className="app pl-14 md:pl-16">
      <ThreeViewer speaking={speaking} avatar={avatar} armAngle={armAngle} />
      <ChatHistory messages={chat} loading={loading} />
      <ChatBox onSend={sendMessage} />
      <SidePanel
        avatar={avatar}
        onAvatarChange={trocarAvatar}
        personalidade={personalidade}
        onPersonalidadeChange={setPersonalidade}
        armAngle={armAngle}
        onArmAngleChange={setArmAngle}
      />
    </div>
  )
}
