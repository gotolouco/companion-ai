import { Canvas } from '@react-three/fiber'
import { VRMAvatar } from './VRMAvatar'
import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'

export default function ThreeViewer() {

  const controls = useRef()

  const {avatar} = useControls("VRM", {

    avatar: {
      value: 'example.vrm',
    }

  });

  return (
    <Canvas camera={{ position: [0, 1, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <VRMAvatar avatar={avatar} />
      <OrbitControls />
    </Canvas>
  )
}
