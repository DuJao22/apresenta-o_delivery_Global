import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PerspectiveCamera, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import Phone from './Phone';
import { Suspense } from 'react';

interface SceneProps {
  scrollRef: React.MutableRefObject<number>;
}

export default function Scene({ scrollRef }: SceneProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Canvas 
        shadows 
        dpr={[1, 2]} // Support for Retina/High-DPI 
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true,
          precision: "highp",
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[512, 512]} 
        />
        
        <Suspense fallback={null}>
          <Phone scrollRef={scrollRef} />
          <Environment preset="city" />
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4.5} 
            resolution={256}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
