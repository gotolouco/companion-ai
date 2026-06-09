# Companion AI 

Um **companheiro virtual em 3D**: um avatar VRM renderizado em tempo real que conversa com você através de um chat conectado a um modelo de linguagem (LLM). 

## ✨ Funcionalidades

### Conversa com IA
- **Chat com LLM** via [Groq](https://groq.com/) (modelo `llama-3.3-70b-versatile`), com respostas rápidas.
- **Memória de contexto** — o histórico inteiro da conversa é enviado ao modelo, então o companheiro lembra do que foi dito antes.
- **Fundo de Tela** — Deixe sua conversa mais estilosa com um fundo de tela que vc pode escolher, desde uma praia a uma cidade vibrante.
- **Personalidades** selecionáveis (Amigável, Profissional, Engraçado, Sarcástico) que alteram o tom das respostas via *system prompt*.
- **Respostas humanizadas** — o prompt instrui o modelo a falar de forma natural e coloquial, sem listas, títulos ou linguagem de manual.
- **Tratamento de erros amigável** — mensagens claras na tela para falhas de chave (401), modelo (404) ou limite de uso (429).

### Avatar 3D
- **Renderização VRM** com [Three.js](https://threejs.org/) + [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) e [@pixiv/three-vrm](https://github.com/pixiv/three-vrm).
- **Seleção de modelo** — dropdown que lista os avatares disponíveis na pasta `public/models/`.
- **Animação procedural** — respiração, balanço sutil do corpo, oscilação da cabeça e piscar automáticos.
- **Pose natural** — braços baixados (saindo da T-pose), cotovelos levemente dobrados, com ângulo **ajustável por um slider** (cada modelo tem um rig diferente).
- **Lip-sync** — o avatar mexe a boca enquanto "fala" a resposta, por um tempo proporcional ao tamanho do texto.
- **Orientação automática** — modelos VRM 0.x são girados para ficar de frente para a câmera.
- **Saudação ao trocar** — ao escolher um novo avatar, ele se apresenta dizendo o próprio nome.
- **Controles de câmera** — orbitar, aproximar e afastar com o mouse ([OrbitControls](https://github.com/pmndrs/drei)).

### Interface
- **Sidebar retrátil** — uma coluna fina sempre visível (logo + ícones) que expande para um painel com os controles de configuração.
- **Design system** com [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + ícones [lucide-react](https://lucide.dev/).
- **Layout responsivo** — adapta-se a telas de celular a desktop.

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Build / dev | Vite 7 |
| UI | React 19 |
| Estilo | Tailwind CSS 4 + shadcn/ui |
| Ícones | lucide-react |
| 3D | three, @react-three/fiber, @react-three/drei |
| VRM | @pixiv/three-vrm |
| IA | Groq API (compatível com OpenAI) |

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar a chave de API
Crie um arquivo `.env` na raiz (use `.env.example` como base) com sua chave do Groq:
```env
VITE_GROQ_KEY=sua-chave-aqui
```
> Pegue uma chave gratuita em [console.groq.com](https://console.groq.com/keys).

### 3. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse o endereço exibido no terminal (geralmente `http://localhost:5173`).

## 📦 Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Gera a build de produção em `dist/` |
| `npm run preview` | Pré-visualiza a build de produção |
| `npm run lint` | Roda o ESLint |
| `npm run models` | Regenera a lista de avatares a partir de `public/models/` |

## 🎭 Adicionar um novo avatar

1. Coloque o arquivo `.vrm` em `public/models/`.
2. Rode `npm run models` para atualizar a lista.
3. O modelo aparecerá no dropdown da sidebar.

> Os arquivos precisam ser **VRM** (não GLB/FBX). Modelos VRM com rig humanoide e *blendshapes* de boca (`A I U E O`) aproveitam todas as animações e o lip-sync.

## 📁 Estrutura

```
src/
├── App.jsx                  # Orquestra os componentes e o estado global
├── components/
│   ├── ChatBox.jsx          # Campo de envio de mensagem
│   ├── ChatHistory.jsx      # Balões da conversa + indicador "digitando"
│   ├── ThreeViewer.jsx      # Cena 3D (Canvas, luzes, câmera)
│   ├── VRMAvatar.jsx        # Carrega e anima o avatar VRM
│   ├── SidePanel.jsx        # Sidebar (orquestra os subcomponentes)
│   ├── sidebar/             # Subcomponentes da sidebar
│   └── ui/                  # Componentes do shadcn/ui
├── hooks/
│   └── useChat.js           # Estado e lógica da conversa
└── lib/
    ├── llm.js               # Comunicação com o LLM (Groq)
    ├── vrm.js               # Helpers de pose, animação e expressões
    ├── models.js            # Lista de avatares (gerada)
    ├── personalidades.js    # Personalidades disponíveis
    └── utils.js             # Utilitário cn() do shadcn
```


