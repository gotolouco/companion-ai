import { useGLTF } from "@react-three/drei";
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { useEffect } from "react";


export const VRMAvatar = ({ avatar, ...props }) => {
        const { scene, userData } = useGLTF(`models/${avatar}`, undefined, undefined, (loader) => {
            loader.register((parser) => {
                return new VRMLoaderPlugin(parser);
            });
        }
    );

    useEffect(() => {

        const vrm = userData.vrm;

    	// calling these functions greatly improves the performance
		VRMUtils.removeUnnecessaryVertices( scene );
		VRMUtils.combineSkeletons( scene );
		VRMUtils.combineMorphs( vrm );

		// Disable frustum culling
		vrm.scene.traverse( ( obj ) => {

		     obj.frustumCulled = false;

		} );    
    }, {scene}); 

    return (
        <group {...props}>
            <primitive object={scene}/>
        </group>
    )

};