// Hook para gerar intensidades de vogais (blendshapes) baseado no texto falado entreges pela IA
// Simula a abertura da boca e a formação de vogais (aa, ih, uu, eh, oh), baseando-se na sequência de caracteres e na duração calculada.
import { useEffect, useRef, useState } from 'react';

// Mapeamento de vogais para blendshapes do VRM
const VOWEL_PATTERNS = {
  aa: /[áàâãa]/i,
  eh: /[éèêe]/i,
  ih: /[íìîi]/i,
  oh: /[óòôõo]/i,
  uu: /[úùûu]/i,
};

// Identifica a vogal predominante em um único caractere. Retorna a vogal predominante para um caractere (ou null se consoante)
function getVowelIntensity(char) {
  for (const [vowel, pattern] of Object.entries(VOWEL_PATTERNS)) {
    if (pattern.test(char)) return { [vowel]: 1 };
  }
  return null;
}

// Constroi uma linha do tempo de intensidades de vogais baseada no texto e duração
function buildTimeline(text, durationMs) {
  const chars = text.split('');
  // Taxa de quadros virtual: ~20 fps (50ms por quadro)
  const totalFrames = Math.max(20, Math.min(120, Math.floor(durationMs / 50)));
  const frameDuration = durationMs / totalFrames;
  const timeline = [];

  for (let i = 0; i < totalFrames; i++) {
    const progress = i / totalFrames; // 0..1
    const charIndex = Math.min(chars.length - 1, Math.floor(progress * chars.length));
    const currentChar = chars[charIndex];
    const vowelData = getVowelIntensity(currentChar);
    const prevChar = charIndex > 0 ? chars[charIndex - 1] : null;
    const prevVowel = prevChar ? getVowelIntensity(prevChar) : null;

    let intensities = { aa: 0, ih: 0, uu: 0, eh: 0, oh: 0 };
    if (vowelData) {
      intensities = { ...intensities, ...vowelData };
    } else if (prevVowel) {
      // Mantém a última vogal para transição suave
      intensities = { ...intensities, ...prevVowel };
    } else {
      // Boca ligeiramente aberta para consoantes
      intensities.aa = 0.2;
    }

    // Simula abertura geral (volume) baseado na presença de vogal
    const isVowel = !!vowelData;
    const openness = isVowel ? 0.6 + Math.random() * 0.4 : 0.1;
    intensities.aa = Math.min(1, intensities.aa + openness * 0.6);

    timeline.push({
      time: i * frameDuration,
      intensities,
    });
  }
  return timeline;
}

/**
 * Hook que retorna as intensidades das vogais em tempo real baseado no texto falado.
 * @param {string} text - Mensagem que o bot está "falando"
 * @param {boolean} isSpeaking - Se o avatar está em estado de fala
 * @returns {object} Intensidades atuais { aa, ih, uu, eh, oh }
 */
export function useTextLipSync(text, isSpeaking) {
  const [currentIntensities, setCurrentIntensities] = useState({
    aa: 0, ih: 0, uu: 0, eh: 0, oh: 0,
  });
  const startTimeRef = useRef(null);
  const timelineRef = useRef([]);
  const frameRef = useRef(null);

  useEffect(() => {
    // Cancela animação anterior ao parar de falar ou mudar texto
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (!isSpeaking || !text) {
      setCurrentIntensities({ aa: 0, ih: 0, uu: 0, eh: 0, oh: 0 });
      return;
    }

    // Duração proporcional ao texto (entre 1s e 6s)
    const duration = Math.min(6000, Math.max(1000, text.length * 80));
    const timeline = buildTimeline(text, duration);
    timelineRef.current = timeline;
    startTimeRef.current = performance.now();

    let previousIntensities = { aa: 0, ih: 0, uu: 0, eh: 0, oh: 0 };

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      if (elapsed >= duration) {
        setCurrentIntensities({ aa: 0, ih: 0, uu: 0, eh: 0, oh: 0 });
        return;
      }

      // Encontra o frame atual baseado no tempo decorrido
      let idx = 0;
      for (let i = 0; i < timeline.length; i++) {
        if (elapsed >= timeline[i].time) idx = i;
        else break;
      }
      const target = timeline[idx]?.intensities || timeline[timeline.length - 1]?.intensities;

      if (target) {
        // Suavização (lerp) entre frames para evitar mudanças bruscas
        const lerp = (a, b, t) => a + (b - a) * t;
        const factor = 0.4;
        const smoothed = {
          aa: lerp(previousIntensities.aa, target.aa, factor),
          ih: lerp(previousIntensities.ih, target.ih, factor),
          uu: lerp(previousIntensities.uu, target.uu, factor),
          eh: lerp(previousIntensities.eh, target.eh, factor),
          oh: lerp(previousIntensities.oh, target.oh, factor),
        };
        previousIntensities = smoothed;
        setCurrentIntensities(smoothed);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, isSpeaking]);

  return currentIntensities;
}