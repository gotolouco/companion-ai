import { useState } from 'react'
import ThreeViewer from './components/ThreeViewer'
import ChatBox from './components/ChatBox'
import SidePanel from './components/SidePanel'
import './index.css'

export default function App() {
  const [chat, setChat] = useState([])

  const handleSend = (msg) => {
    setChat(prev => [...prev, { sender: 'user', text: msg }])
    // futuro: chamar API de IA
    setChat(prev => [...prev, { sender: 'bot', text: "Resposta da IA..." }])
  }

  return (
    <div className="app">
      <ThreeViewer />
      <ChatBox onSend={handleSend} />
      <SidePanel  />
    </div>
  )
}
