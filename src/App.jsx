import { useState, useEffect } from 'react';
import ThreeViewer from './components/ThreeViewer';
import ChatBox from './components/ChatBox';
import ChatHistory from './components/ChatHistory';
import SidePanel from './components/SidePanel';
import { useChat } from '@/hooks/useChat';
import { MODELOS } from '@/lib/models';
import { PERSONALIDADE_PADRAO } from '@/lib/personalidades';
import './index.css';

// Saudação que o personagem fala ao ser selecionado, usando o nome do modelo
function saudacaoDoModelo(file) {
  const nome = MODELOS.find((m) => m.file === file)?.label || 'seu companheiro';
  return `Oi! Eu sou ${nome}. Prazer em te conhecer — como você está?`;
}

export default function App() {
  const [personalidade, setPersonalidade] = useState(PERSONALIDADE_PADRAO);
  const [avatar, setAvatar] = useState(MODELOS[0]?.file);
  const [armAngle, setArmAngle] = useState(1.35);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const { chat, loading, speaking, sendMessage, falarComoBot, lastBotMessage } = useChat(personalidade);

  const trocarAvatar = (file) => {
    setAvatar(file);
    falarComoBot(saudacaoDoModelo(file));
  };

  return (
    <div className="app pl-14 md:pl-16">
      <ThreeViewer
        speaking={speaking}
        avatar={avatar}
        armAngle={armAngle}
        botMessage={lastBotMessage}
      />
      <ChatHistory messages={chat} loading={loading} />
      <ChatBox onSend={sendMessage} />
      <SidePanel
        avatar={avatar}
        onAvatarChange={trocarAvatar}
        personalidade={personalidade}
        onPersonalidadeChange={setPersonalidade}
        armAngle={armAngle}
        onArmAngleChange={setArmAngle}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
      />
    </div>
  );
}