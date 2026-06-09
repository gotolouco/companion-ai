import { Canvas } from '@react-three/fiber'
import { VRMAvatar } from './VRMAvatar'
import { OrbitControls } from '@react-three/drei'

export default function ThreeViewer({ speaking = false, avatar = 'example.vrm', armAngle = 1.0, gesture = null }) {
  return (
    <Canvas camera={{ position: [0, 1.3, 1.8], fov: 30 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <VRMAvatar avatar={avatar} speaking={speaking} armAngle={armAngle} gesture={gesture} />
      {/* Mira no tronco e limita o zoom para manter um enquadramento agradável */}
      <OrbitControls target={[0, 1.0, 0]} minDistance={1.2} maxDistance={4} />
    </Canvas>
  )
}
