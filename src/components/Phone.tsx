import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import CustomerApp from './CustomerApp';

interface PhoneProps {
  scrollRef: React.MutableRefObject<number>;
}

export default function Phone({ scrollRef }: PhoneProps) {
  const phoneRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  // Memoize Geometries & Materials
  const geoms = useMemo(() => ({
    screen: new THREE.PlaneGeometry(1.88, 3.88),
    island: new THREE.CapsuleGeometry(0.04, 0.12, 8, 16)
  }), []);

  const mats = useMemo(() => ({
    case: new THREE.MeshPhysicalMaterial({ 
      color: "#080808", metalness: 0.9, roughness: 0.1, envMapIntensity: 1, clearcoat: 1, clearcoatRoughness: 0 
    }),
    frame: new THREE.MeshPhysicalMaterial({ 
      color: "#1a1a1a", metalness: 1, roughness: 0.05, wireframe: true 
    }),
    screen: new THREE.MeshStandardMaterial({ color: "#000", metalness: 1, roughness: 1 }),
    island: new THREE.MeshBasicMaterial({ color: "#000" })
  }), []);

  useFrame((state) => {
    if (!phoneRef.current) return;

    const t = scrollRef.current;
    const time = state.clock.getElapsedTime();
    
    // Animate transformations based on t
    if (t < 0.1) {
      phoneRef.current.visible = t > 0.08;
      const localT = Math.max(0, (t - 0.08) / 0.02);
      phoneRef.current.scale.setScalar(0.6 + localT * 0.4);
      phoneRef.current.rotation.set(0, THREE.MathUtils.lerp(-Math.PI * 0.1, 0, localT), 0);
      phoneRef.current.position.set(0, Math.sin(time * 0.5) * 0.05, 0);
    } 
    else if (t < 0.25) {
      phoneRef.current.visible = true;
      const zoomT = Math.min(1, (t - 0.1) / 0.05);
      const slideT = Math.max(0, (t - 0.15) / 0.1);
      const scale = 1 + zoomT * 0.4;
      const posX = THREE.MathUtils.lerp(0, -2, slideT);
      phoneRef.current.scale.setScalar(scale);
      phoneRef.current.position.set(posX, Math.sin(time * 0.5) * 0.05, 0);
      phoneRef.current.rotation.set(0, Math.PI * 0.05 * slideT, 0);
    }
    else if (t < 0.5) {
      const localT = (t - 0.25) / 0.25;
      const zoomIn = Math.sin(localT * Math.PI) * 0.5;
      phoneRef.current.scale.setScalar(1.4 + zoomIn);
      phoneRef.current.position.set(-2 + localT * 1, Math.sin(time * 0.5) * 0.05, zoomIn * 2);
      phoneRef.current.rotation.set(0, Math.PI * 0.05 + localT * -0.1, 0);
    }
    else if (t < 0.7) {
      const vibrate = t > 0.6 && t < 0.65 ? Math.sin(time * 50) * 0.02 : 0;
      phoneRef.current.scale.setScalar(1.4);
      phoneRef.current.position.set(0 + vibrate, Math.sin(time * 0.5) * 0.05, 2);
      phoneRef.current.rotation.set(0, Math.sin(time * 2) * 0.05, 0);
    }
    else {
      const localT = Math.min(1, (t - 0.7) / 0.05);
      phoneRef.current.scale.setScalar(1.4 * (1 - localT));
      phoneRef.current.position.set(0, 0, 2 - localT * 5);
      phoneRef.current.visible = localT < 1;
    }
  });

  return (
    <group ref={phoneRef}>
      <spotLight position={[5, 10, 5]} intensity={1.5} color="#00ff00" />
      <spotLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />
      
      <RoundedBox args={[2, 4, 0.15]} radius={0.15} smoothness={4} material={mats.case} />
      <RoundedBox args={[2.02, 4.02, 0.1]} radius={0.16} smoothness={4} position={[0,0,0]} material={mats.frame} />

      <mesh ref={screenRef} position={[0, 0, 0.08]} geometry={geoms.screen} material={mats.screen} />

      <group position={[0, 0, 0.085]}>
        <Html
          transform
          distanceFactor={2}
          position={[0, 0, 0]}
          scale={0.5} 
          occlude="blending"
          style={{
            width: '375px',
            height: '812px',
            backgroundColor: 'black',
            overflow: 'auto',
            borderRadius: '44px',
            boxSizing: 'border-box',
            boxShadow: '0 0 40px rgba(0,255,0,0.1)'
          }}
        >
          <div className="w-full h-full scale-[1] origin-top overflow-auto no-scrollbar pointer-events-auto">
            <CustomerApp />
          </div>
        </Html>
      </group>

      <mesh position={[0, 1.82, 0.081]} geometry={geoms.island} material={mats.island} />
    </group>
  );
}
