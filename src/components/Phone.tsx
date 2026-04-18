import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import CustomerApp from './CustomerApp';
import AdminApp from './AdminApp';
import DriverApp from './DriverApp';

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
      color: "#080808", metalness: 0.95, roughness: 0.1, envMapIntensity: 1.5, clearcoat: 1, clearcoatRoughness: 0 
    }),
    frame: new THREE.MeshPhysicalMaterial({ 
      color: "#1a1a1a", metalness: 0.8, roughness: 0.2, wireframe: false 
    }),
    screen: new THREE.MeshStandardMaterial({ color: "#000", metalness: 1, roughness: 1 }),
    island: new THREE.MeshBasicMaterial({ color: "#000" })
  }), []);

  // Internal state for smoothed values
  const internalRef = useRef({
    lerpT: 0,
    pos: new THREE.Vector3(),
    rot: new THREE.Euler(),
    scale: 0.8
  });

  useFrame((state, delta) => {
    if (!phoneRef.current) return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const dampFactor = isTouch ? 6 : 4;

    const targetT = scrollRef.current;
    const time = state.clock.getElapsedTime();
    
    // Smooth the progress value
    internalRef.current.lerpT = THREE.MathUtils.damp(internalRef.current.lerpT, targetT, dampFactor * 0.8, delta);
    const t = internalRef.current.lerpT;

    const targetPos = new THREE.Vector3();
    const targetRot = new THREE.Euler();
    let targetScale = 0.8;
    let visible = true;
    
    // NARRATIVE ANIMATIONS (Matching App.tsx Scenes)
    
    // Initial State: Center (0 - 0.1)
    if (t < 0.15) {
      targetPos.set(0, 0, 0);
      targetRot.set(0, Math.sin(time * 0.5) * 0.1, 0);
      targetScale = THREE.MathUtils.lerp(0, 0.8, Math.min(1, t * 10));
    } 
    // Feature 1: Slide Left for Customer App (0.15 - 0.35)
    else if (t < 0.35) {
      const localT = (t - 0.15) / 0.2;
      targetPos.set(THREE.MathUtils.lerp(0, -2, localT), 0, THREE.MathUtils.lerp(0, 1, localT));
      targetRot.set(0, localT * Math.PI * 0.1, 0);
      targetScale = 0.8 + localT * 0.2;
    }
    // Feature 2: Slide Right for Admin Power (0.35 - 0.55)
    else if (t < 0.55) {
      const localT = (t - 0.35) / 0.2;
      targetPos.set(THREE.MathUtils.lerp(-2, 2, localT), 0, 1);
      targetRot.set(0, (1 - localT * 2) * Math.PI * 0.1, 0);
      targetScale = 1;
    }
    // Feature 3: Action / Notification Hero (0.55 - 0.75)
    else if (t < 0.75) {
      const localT = (t - 0.55) / 0.2;
      targetPos.set(THREE.MathUtils.lerp(2, 0, localT), THREE.MathUtils.lerp(0, 0.5, localT), THREE.MathUtils.lerp(1, 2, localT));
      targetRot.set(Math.sin(time * 2) * 0.05, 0, 0);
      targetScale = 1 + localT * 0.2;
    }
    // Final Offer: Top Center (0.75 - 1.0)
    else {
      const localT = (t - 0.75) / 0.25;
      targetPos.set(0, THREE.MathUtils.lerp(0.5, 3, localT), 2);
      targetRot.set(localT * -Math.PI * 0.2, 0, 0);
      targetScale = 1.2 * (1 - localT * 0.5);
      visible = localT < 0.95;
    }

    // Apply smoothed transformations
    phoneRef.current.position.lerp(targetPos, 0.1);
    phoneRef.current.rotation.x = THREE.MathUtils.damp(phoneRef.current.rotation.x, targetRot.x, dampFactor, delta);
    phoneRef.current.rotation.y = THREE.MathUtils.damp(phoneRef.current.rotation.y, targetRot.y, dampFactor, delta);
    phoneRef.current.rotation.z = THREE.MathUtils.damp(phoneRef.current.rotation.z, targetRot.z, dampFactor, delta);
    phoneRef.current.scale.setScalar(THREE.MathUtils.damp(phoneRef.current.scale.x, targetScale, dampFactor, delta));
    phoneRef.current.visible = visible;
  });

  // Decide which screen to show based on scroll progress
  const renderScreen = () => {
    const t = scrollRef.current;
    if (t < 0.4) return <CustomerApp />;
    if (t < 0.65) return <AdminApp />;
    return <DriverApp />;
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={phoneRef}>
        {/* Dynamic Key Lighting Linked to Position */}
        <pointLight position={[2, 2, 2]} intensity={2} color="#7c3aed" />
        <pointLight position={[-2, -2, 2]} intensity={1} color="#ef4444" />
        
        <RoundedBox args={[2, 4, 0.15]} radius={0.15} smoothness={4} material={mats.case} />
        <RoundedBox args={[2.02, 4.02, 0.1]} radius={0.16} smoothness={4} position={[0,0,0]} material={mats.frame} />

        <mesh ref={screenRef} position={[0, 0, 0.08]} geometry={geoms.screen} material={mats.screen} />

        <group position={[0, 0, 0.085]}>
          <Html
            transform
            distanceFactor={2.1}
            position={[0, 0, 0]}
            scale={0.5} 
            occlude="blending"
            eps={0.0001}
            style={{
              width: '375px',
              height: '812px',
              backgroundColor: '#050505',
              overflow: 'hidden',
              borderRadius: '44px',
              boxSizing: 'border-box',
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
              transform: 'scale(1)',
              pointerEvents: 'auto'
            }}
          >
            <div className="w-full h-full origin-top overflow-hidden no-scrollbar pointer-events-auto bg-[#050505]">
              <div className="w-full h-auto scale-[1]">
                {renderScreen()}
              </div>
            </div>
          </Html>
        </group>

        <mesh position={[0, 1.82, 0.081]} geometry={geoms.island} material={mats.island} />
      </group>
    </Float>
  );
}
