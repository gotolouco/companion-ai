import { useState } from 'react'
import ThreeViewer from './components/ThreeViewer'
import ChatBox from './components/ChatBox'
import ChatHistory from './components/ChatHistory'
import SidePanel from './components/SidePanel'
import { useChat } from '@/hooks/useChat'
import { MODELOS } from '@/lib/models'
import { PERSONALIDADE_PADRAO } from '@/lib/personalidades'
import './index.css'


function saudacaoDoModelo(file) {
  const nome = MODELOS.find((m) => m.file === file)?.label || 'seu companheiro'
  return `Oi! Eu sou ${nome}. Prazer em te conhecer, como você está?`
}

export default function App() {
  const [personalidade, setPersonalidade] = useState(PERSONALIDADE_PADRAO)
  const [avatar, setAvatar] = useState(MODELOS[0]?.file)
  const [armAngle, setArmAngle] = useState(1.35)
  const [background, setBackground] = useState(null)

  const { chat, loading, speaking, gesture, sendMessage, falarComoBot } =
    useChat(personalidade)

  const trocarAvatar = (file) => {
    setAvatar(file)
    falarComoBot(saudacaoDoModelo(file))
  }

  
  const appStyle = background
    ? { backgroundImage: `url(/assets/${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  return (
    <div className="app pl-0 sm:pl-16" style={appStyle}>
      <ThreeViewer speaking={speaking} avatar={avatar} armAngle={armAngle} gesture={gesture} />
      <ChatHistory messages={chat} loading={loading} />
      <ChatBox onSend={sendMessage} />
      <SidePanel
        avatar={avatar}
        onAvatarChange={trocarAvatar}
        personalidade={personalidade}
        onPersonalidadeChange={setPersonalidade}
        armAngle={armAngle}
        onArmAngleChange={setArmAngle}
        background={background}
        onBackgroundChange={setBackground}
      />
    </div>
  )
}
