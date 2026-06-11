import { Canvas } from '@react-three/fiber';
import { VRMAvatar } from './VRMAvatar';
import { OrbitControls } from '@react-three/drei';

export default function ThreeViewer({ speaking = false, avatar = 'example.vrm', armAngle = 1.0, botMessage = '' }) {
  return (
    <Canvas camera={{ position: [0, 1.3, 1.8], fov: 30 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <VRMAvatar
        avatar={avatar}
        speaking={speaking}
        armAngle={armAngle}
        botMessage={botMessage}
      />
      <OrbitControls target={[0, 1.0, 0]} minDistance={1.2} maxDistance={4} />
    </Canvas>
  );
}