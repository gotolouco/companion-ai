import { VRMUtils } from '@pixiv/three-vrm'


const POSE = {
  spread: 0.12,   
  forward: 0.18,  
  elbow: 0.25,    
}

export function setExpr(expr, names, value) {
  for (const name of names) {
    if (expr.getExpression?.(name)) {
      expr.setValue(name, value)
    }
  }
}


export function prepararAvatar(scene, vrm) {
  VRMUtils.removeUnnecessaryVertices(scene)
  VRMUtils.combineSkeletons(scene)
  VRMUtils.combineMorphs(vrm)

 
  VRMUtils.rotateVRM0(vrm)

  vrm.scene.traverse((obj) => {
    obj.frustumCulled = false
  })
}


function applyArmPose(humanoid, armAngle, sway) {
  const leftUpperArm = humanoid?.getNormalizedBoneNode("leftUpperArm")
  const rightUpperArm = humanoid?.getNormalizedBoneNode("rightUpperArm")
  const leftLowerArm = humanoid?.getNormalizedBoneNode("leftLowerArm")
  const rightLowerArm = humanoid?.getNormalizedBoneNode("rightLowerArm")

  if (leftUpperArm) {
    leftUpperArm.rotation.set(POSE.forward, 0, armAngle - POSE.spread + sway)
  }
  if (rightUpperArm) {
    rightUpperArm.rotation.set(POSE.forward, 0, -armAngle + POSE.spread - sway)
  }
  if (leftLowerArm) leftLowerArm.rotation.set(0, -POSE.elbow, 0)
  if (rightLowerArm) rightLowerArm.rotation.set(0, POSE.elbow, 0)
}


function applyIdleMotion(humanoid, t, breath) {
  const chest = humanoid?.getNormalizedBoneNode("chest")
  if (chest) chest.rotation.x = breath * 0.02

  const spine = humanoid?.getNormalizedBoneNode("spine")
  if (spine) spine.rotation.y = Math.sin(t * 0.6) * 0.03

  const head = humanoid?.getNormalizedBoneNode("head")
  if (head) head.rotation.x = Math.sin(t * 0.8) * 0.02
}


function applyBlink(expr, t) {
  const blink = Math.sin(t * 2.5) > 0.97 ? 1 : 0
  setExpr(expr, ["blink", "Blink"], blink)
}


function applyLipSync(expr, t, speaking) {
  const mouth = speaking ? (Math.sin(t * 12) * 0.5 + 0.5) : 0
  setExpr(expr, ["aa", "A"], mouth)
  setExpr(expr, ["ih", "I"], 0)
  setExpr(expr, ["ou", "U"], 0)
  setExpr(expr, ["ee", "E"], 0)
  setExpr(expr, ["oh", "O"], 0)
}


function applyHeadGesture(humanoid, t, gesture) {
  const head = humanoid?.getNormalizedBoneNode("head")
  if (!head) return
  const osc = Math.sin(t * 9) * 0.25
  if (gesture === "nod") head.rotation.x = osc
  else if (gesture === "shake") head.rotation.y = osc
}

/**
 * @param {object} vrm 
 * @param {number} t 
 * @param {number} delta 
 * @param {boolean} speaking
 * @param {number} armAngle 
 * @param {string|null} gesture 
 */
export function animarAvatar(vrm, t, delta, speaking, armAngle = 1.0, gesture = null) {
  const humanoid = vrm.humanoid
  const breath = Math.sin(t * 1.5)

  applyArmPose(humanoid, armAngle, breath * 0.02)
  applyIdleMotion(humanoid, t, breath)
  applyHeadGesture(humanoid, t, gesture)

  const expr = vrm.expressionManager
  if (expr) {
    applyBlink(expr, t)
    applyLipSync(expr, t, speaking)
  }

  vrm.update(delta)
}
