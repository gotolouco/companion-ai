import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { useEffect, useRef } from "react";
import { prepararAvatar, animarAvatar } from "@/lib/vrm";

export const VRMAvatar = ({ avatar, speaking = false, armAngle = 1.0, ...props }) => {
    const { scene, userData } = useGLTF(`models/${avatar}`, undefined, undefined, (loader) => {
        loader.register((parser) => {
            return new VRMLoaderPlugin(parser);
        });
    });

    
    const speakingRef = useRef(speaking);
    speakingRef.current = speaking;
    const armAngleRef = useRef(armAngle);
    armAngleRef.current = armAngle;

    useEffect(() => {
        prepararAvatar(scene, userData.vrm);
    }, [scene]);

    useFrame((state, delta) => {
        const vrm = userData.vrm;
        if (!vrm) return;
        animarAvatar(vrm, state.clock.elapsedTime, delta, speakingRef.current, armAngleRef.current);
    });

    return (
        <group {...props}>
            <primitive object={scene} />
        </group>
    );
};
