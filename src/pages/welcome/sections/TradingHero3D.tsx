import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Preload } from '@react-three/drei';
import * as THREE from 'three';

// Floating particles representing market liquidity/data flow
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// 3D Candlestick representation
function Candlestick({ position, height, isGreen }: { position: [number, number, number]; height: number; isGreen: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Wick */}
      <mesh>
        <boxGeometry args={[0.02, height, 0.02]} />
        <meshStandardMaterial color={isGreen ? '#10b981' : '#ef4444'} emissive={isGreen ? '#10b981' : '#ef4444'} emissiveIntensity={0.5} />
      </mesh>
      {/* Body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.15, height * 0.6, 0.15]} />
        <meshStandardMaterial 
          color={isGreen ? '#10b981' : '#ef4444'} 
          emissive={isGreen ? '#10b981' : '#ef4444'} 
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Grid of candlesticks
function CandlestickGrid() {
  const candlesticks = useMemo(() => {
    const sticks = [];
    const rows = 8;
    const cols = 12;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j - cols / 2) * 0.4;
        const z = (i - rows / 2) * 0.4;
        const height = Math.random() * 0.5 + 0.3;
        const isGreen = Math.random() > 0.5;
        sticks.push({ position: [x, 0, z] as [number, number, number], height, isGreen });
      }
    }
    return sticks;
  }, []);

  return (
    <>
      {candlesticks.map((stick, idx) => (
        <Candlestick key={idx} {...stick} />
      ))}
    </>
  );
}

// Main 3D Scene
function TradingScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.5} />
      
      <FloatingParticles />
      <CandlestickGrid />
      
      {/* Grid plane for reference */}
      <gridHelper args={[20, 20, '#1e293b', '#0f172a']} position={[0, -2, 0]} />
    </>
  );
}

// Canvas wrapper with performance optimization
export default function TradingHero3D() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-30">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.5}
          />
          <TradingScene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
