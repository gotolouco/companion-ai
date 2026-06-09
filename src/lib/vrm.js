// Helpers para manipular avatares VRM (expressões, pose e animação procedural).
import { VRMUtils } from '@pixiv/three-vrm'

// Constantes de calibragem da pose de descanso (idle relaxado).
const POSE = {
  spread: 0.12,   // afastamento dos braços em relação ao corpo
  forward: 0.18,  // braços levemente à frente
  elbow: 0.25,    // dobra do cotovelo (evita braço reto/rígido)
}

/**
 * Define um valor de expressão tentando vários nomes possíveis (VRM 1.0 e 0.x).
 * O three-vrm normaliza os nomes, mas modelos antigos podem usar os rótulos originais.
 */
export function setExpr(expr, names, value) {
  for (const name of names) {
    try {
      expr.setValue(name, value)
    } catch {
      // nome inexistente nesse modelo — ignora e tenta o próximo
    }
  }
}

/**
 * Otimizações de performance + orientação inicial do avatar.
 */
export function prepararAvatar(scene, vrm) {
  VRMUtils.removeUnnecessaryVertices(scene)
  VRMUtils.combineSkeletons(scene)
  VRMUtils.combineMorphs(vrm)

  // VRM 0.x são exportados virados de costas (olhando para -Z). Este helper
  // gira o modelo 180° para que ele fique DE FRENTE para a câmera (+Z).
  VRMUtils.rotateVRM0(vrm)

  vrm.scene.traverse((obj) => {
    obj.frustumCulled = false
  })
}

// Pose natural dos braços: baixa da T-pose (armAngle), afasta do corpo,
// joga levemente à frente e dobra o cotovelo. `sway` adiciona a respiração.
function applyArmPose(humanoid, armAngle, sway) {
  const leftUpperArm = humanoid?.getNormalizedBoneNode("leftUpperArm")
  const rightUpperArm = humanoid?.getNormalizedBoneNode("rightUpperArm")
  const leftLowerArm = humanoid?.getNormalizedBoneNode("leftLowerArm")
  const rightLowerArm = humanoid?.getNormalizedBoneNode("rightLowerArm")

  if (leftUpperArm) {
    leftUpperArm.rotation.z = armAngle - POSE.spread + sway
    leftUpperArm.rotation.x = POSE.forward
  }
  if (rightUpperArm) {
    rightUpperArm.rotation.z = -armAngle + POSE.spread - sway
    rightUpperArm.rotation.x = POSE.forward
  }
  if (leftLowerArm) leftLowerArm.rotation.y = -POSE.elbow
  if (rightLowerArm) rightLowerArm.rotation.y = POSE.elbow
}

// Respiração e balanço sutis no peito, tronco e cabeça.
function applyIdleMotion(humanoid, t, breath) {
  const chest = humanoid?.getNormalizedBoneNode("chest")
  if (chest) chest.rotation.x = breath * 0.02

  const spine = humanoid?.getNormalizedBoneNode("spine")
  if (spine) spine.rotation.y = Math.sin(t * 0.6) * 0.03

  const head = humanoid?.getNormalizedBoneNode("head")
  if (head) head.rotation.x = Math.sin(t * 0.8) * 0.02
}

// Piscar: fecha os olhos rapidamente em intervalos.
function applyBlink(expr, t) {
  const blink = Math.sin(t * 2.5) > 0.97 ? 1 : 0
  setExpr(expr, ["blink", "Blink"], blink)
}

// Lip-sync: enquanto "falando", oscila a abertura da boca (visema A/aa).
function applyLipSync(expr, t, speaking) {
  const mouth = speaking ? (Math.sin(t * 12) * 0.5 + 0.5) : 0
  setExpr(expr, ["aa", "A"], mouth)
  setExpr(expr, ["ih", "I"], 0)
  setExpr(expr, ["ou", "U"], 0)
  setExpr(expr, ["ee", "E"], 0)
  setExpr(expr, ["oh", "O"], 0)
}

/**
 * Animação procedural aplicada a cada quadro.
 * @param {object} vrm - instância do VRM
 * @param {number} t - tempo decorrido (segundos)
 * @param {number} delta - tempo desde o último quadro
 * @param {boolean} speaking - se o avatar está "falando" (move a boca)
 * @param {number} armAngle - quanto baixar os braços (radianos); 0 = T-pose
 */
export function animarAvatar(vrm, t, delta, speaking, armAngle = 1.0) {
  const humanoid = vrm.humanoid
  const breath = Math.sin(t * 1.5)

  applyArmPose(humanoid, armAngle, breath * 0.02)
  applyIdleMotion(humanoid, t, breath)

  const expr = vrm.expressionManager
  if (expr) {
    applyBlink(expr, t)
    applyLipSync(expr, t, speaking)
  }

  vrm.update(delta)
}
