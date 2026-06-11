import { VRMUtils } from '@pixiv/three-vrm';

// Constantes de calibragem da pose de descanso (idle relaxado).
const POSE = {
  spread: 0.12,
  forward: 0.18,
  elbow: 0.25,
};

// Mapeamento de vogais para nomes de blendshapes no VRM (versões 0.x e 1.0)
const vowelMappings = {
  aa: ['aa', 'A', 'a'],
  ih: ['ih', 'I', 'i'],
  uu: ['ou', 'U', 'uu'],
  eh: ['eh', 'E', 'e'],
  oh: ['oh', 'O', 'o'],
};

// Fator de suavização para evitar jittering (caso queira dupla suavização)
// Velocidade que ocorre a mudanças da expressões labiasis 
const LERP_FACTOR = 0.5;
let previousVowels = { aa: 0, ih: 0, uu: 0, eh: 0, oh: 0 };

// Função auxiliar para definir expressão com tentativa de múltiplos nomes
export function setExpr(expr, names, value) {
  for (const name of names) {
    try {
      expr.setValue(name, value);
    } catch {
      // nome inexistente nesse modelo — ignora
    }
  }
}

// Otimizações e orientação inicial do avatar
export function prepararAvatar(scene, vrm) {
  VRMUtils.removeUnnecessaryVertices(scene);
  VRMUtils.combineSkeletons(scene);
  VRMUtils.combineMorphs(vrm);
  VRMUtils.rotateVRM0(vrm);
  vrm.scene.traverse((obj) => {
    obj.frustumCulled = false;
  });
}

// Pose natural dos braços
function applyArmPose(humanoid, armAngle, sway) {
  const leftUpperArm = humanoid?.getNormalizedBoneNode("leftUpperArm");
  const rightUpperArm = humanoid?.getNormalizedBoneNode("rightUpperArm");
  const leftLowerArm = humanoid?.getNormalizedBoneNode("leftLowerArm");
  const rightLowerArm = humanoid?.getNormalizedBoneNode("rightLowerArm");

  if (leftUpperArm) {
    leftUpperArm.rotation.z = armAngle - POSE.spread + sway;
    leftUpperArm.rotation.x = POSE.forward;
  }
  if (rightUpperArm) {
    rightUpperArm.rotation.z = -armAngle + POSE.spread - sway;
    rightUpperArm.rotation.x = POSE.forward;
  }
  if (leftLowerArm) leftLowerArm.rotation.y = -POSE.elbow;
  if (rightLowerArm) rightLowerArm.rotation.y = POSE.elbow;
}

// Respiração e balanço sutis
function applyIdleMotion(humanoid, t, breath) {
  const chest = humanoid?.getNormalizedBoneNode("chest");
  if (chest) chest.rotation.x = breath * 0.02;
  const spine = humanoid?.getNormalizedBoneNode("spine");
  if (spine) spine.rotation.y = Math.sin(t * 0.6) * 0.03;
  const head = humanoid?.getNormalizedBoneNode("head");
  if (head) head.rotation.x = Math.sin(t * 0.8) * 0.02;
}

// Piscar
function applyBlink(expr, t) {
  const blink = Math.sin(t * 2.5) > 0.97 ? 1 : 0;
  setExpr(expr, ["blink", "Blink"], blink);
}

// Aplica lip-sync com base nas intensidades das vogais (com suavização opcional)
export function applyAdvancedLipSync(expr, intensities) {
  if (!expr) return;
  // Suavização para evitar mudanças muito rápidas (opcional, mas recomendo)
  const smoothed = {};
  for (const [vowel, value] of Object.entries(intensities)) {
    const prev = previousVowels[vowel] || 0;
    smoothed[vowel] = prev + (value - prev) * LERP_FACTOR;
  }
  previousVowels = smoothed;

  for (const [vowel, value] of Object.entries(smoothed)) {
    const names = vowelMappings[vowel];
    setExpr(expr, names, value);
  }
}

// Função principal de animação que recebe as intensidades diretamente (sem áudio)
export function animarAvatarComIntensidades(vrm, t, delta, intensities, armAngle = 1.0) {
  const humanoid = vrm.humanoid;
  const breath = Math.sin(t * 1.5);

  applyArmPose(humanoid, armAngle, breath * 0.02);
  applyIdleMotion(humanoid, t, breath);

  const expr = vrm.expressionManager;
  if (expr) {
    applyBlink(expr, t);
    if (intensities && Object.values(intensities).some(v => v > 0)) {
      applyAdvancedLipSync(expr, intensities);
    } else {
      // Fecha a boca quando não há fala
      applyAdvancedLipSync(expr, { aa: 0, ih: 0, uu: 0, eh: 0, oh: 0 });
    }
  }

  vrm.update(delta);
}

// Mantenha a função antiga se ainda for usada em algum lugar (opcional)
export function animarAvatar(vrm, t, delta, speaking, armAngle = 1.0) {
  // fallback para compatibilidade
  const intensities = speaking ? { aa: 0.5, ih: 0, uu: 0, eh: 0, oh: 0 } : { aa: 0, ih: 0, uu: 0, eh: 0, oh: 0 };
  animarAvatarComIntensidades(vrm, t, delta, intensities, armAngle);
}