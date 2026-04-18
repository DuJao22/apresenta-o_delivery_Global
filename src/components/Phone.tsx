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

  // Internal state for smoothed values
  const internalRef = useRef({
    lerpT: 0,
    pos: new THREE.Vector3(),
    rot: new THREE.Euler(),
    scale: 1
  });

  useFrame((state, delta) => {
    if (!phoneRef.current) return;

    // Detect touch for damping adjustment
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const dampFactor = isTouch ? 6 : 4; // Quicker response on mobile

    const targetT = scrollRef.current;
    const time = state.clock.getElapsedTime();
    
    // Smooth the progress value itself first
    internalRef.current.lerpT = THREE.MathUtils.damp(internalRef.current.lerpT, targetT, dampFactor, delta);
    const t = internalRef.current.lerpT;

    const targetPos = new THREE.Vector3();
    const targetRot = new THREE.Euler();
    let targetScale = 1;
    let visible = true;
    
    // Animate transformations based on t
    if (t < 0.1) {
      visible = t > 0.08;
      const localT = Math.max(0, (t - 0.08) / 0.02);
      targetScale = 0.6 + localT * 0.4;
      targetRot.set(0, THREE.MathUtils.lerp(-Math.PI * 0.1, 0, localT), 0);
      targetPos.set(0, Math.sin(time * 0.5) * 0.05, 0);
    } 
    else if (t < 0.25) {
      visible = true;
      const zoomT = Math.min(1, (t - 0.1) / 0.05);
      const slideT = Math.max(0, (t - 0.15) / 0.1);
      targetScale = 1 + zoomT * 0.4;
      const posX = THREE.MathUtils.lerp(0, -2, slideT);
      targetPos.set(posX, Math.sin(time * 0.5) * 0.05, 0);
      targetRot.set(0, Math.PI * 0.05 * slideT, 0);
    }
    else if (t < 0.5) {
      const localT = (t - 0.25) / 0.25;
      const zoomIn = Math.sin(localT * Math.PI) * 0.5;
      targetScale = 1.4 + zoomIn;
      targetPos.set(-2 + localT * 1, Math.sin(time * 0.5) * 0.05, zoomIn * 2);
      targetRot.set(0, Math.PI * 0.05 + localT * -0.1, 0);
    }
    else if (t < 0.7) {
      const vibrate = t > 0.6 && t < 0.65 ? Math.sin(time * 50) * 0.02 : 0;
      targetScale = 1.4;
      targetPos.set(0 + vibrate, Math.sin(time * 0.5) * 0.05, 2);
      targetRot.set(0, Math.sin(time * 2) * 0.05, 0);
    }
    else {
      const localT = Math.min(1, (t - 0.7) / 0.05);
      targetScale = 1.4 * (1 - localT);
      targetPos.set(0, 0, 2 - localT * 5);
      visible = localT < 1;
    }

    // Apply smoothed transformations with damp
    phoneRef.current.position.lerp(targetPos, isTouch ? 0.2 : 0.1);
    phoneRef.current.rotation.x = THREE.MathUtils.damp(phoneRef.current.rotation.x, targetRot.x, dampFactor, delta);
    phoneRef.current.rotation.y = THREE.MathUtils.damp(phoneRef.current.rotation.y, targetRot.y, dampFactor, delta);
    phoneRef.current.rotation.z = THREE.MathUtils.damp(phoneRef.current.rotation.z, targetRot.z, dampFactor, delta);
    phoneRef.current.scale.setScalar(THREE.MathUtils.damp(phoneRef.current.scale.x, targetScale, dampFactor, delta));
    phoneRef.current.visible = visible;
  });

  return (
    <group ref={phoneRef}>
      {/* Dynamic Key Lighting */}
      <spotLight position={[5, 10, 5]} intensity={1.5} color="#00ff00" />
      <spotLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />
      
      {/* High-End Atmospheric Glow Plane */}
      <mesh position={[0, 0, -0.2]} scale={[1.2, 1.2, 1]}>
        <planeGeometry args={[4, 6]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>

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
          eps={0.0001} // High Precision to prevent jitter
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
