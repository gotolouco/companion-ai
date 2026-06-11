import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { useEffect, useRef } from "react";
import { prepararAvatar, animarAvatarComIntensidades } from "@/lib/vrm";
import { useTextLipSync } from "@/hooks/useTextLipSync";

export const VRMAvatar = ({ avatar, speaking = false, armAngle = 1.0, botMessage = "" }) => {
    // Carrega o modelo VRM (arquivo deve estar em public/models/)
  const { scene, userData } = useGLTF(`models/${avatar}`, undefined, undefined, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });

  const speakingRef = useRef(speaking);
  const armAngleRef = useRef(armAngle);
  const intensities = useTextLipSync(botMessage, speaking);

  // Sincroniza as refs com os valores atuais das props
  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  useEffect(() => {
    armAngleRef.current = armAngle;
  }, [armAngle]);

  // Prepara o avatar assim que o modelo estiver carregado (otimizações, rotação inicial)
  useEffect(() => {
    if (scene && userData.vrm) {
      prepararAvatar(scene, userData.vrm);
    }
  }, [scene, userData.vrm]);

    // Loop de animação: a cada frame, atualiza o VRM com as intensidades atuais
  useFrame((state, delta) => {
    const vrm = userData.vrm;
    if (!vrm) return;
    animarAvatarComIntensidades(vrm, state.clock.elapsedTime, delta, intensities, armAngleRef.current);
  });

  return <primitive object={scene} />;
};