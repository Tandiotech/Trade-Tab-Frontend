/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { motion } from "framer-motion";

const Helix = ({ length = 150 }) => {
  const groupRef = React.useRef();
  const materialA = new THREE.MeshStandardMaterial({ 
    color: "#10B981", // Green
    metalness: 0.3,
    roughness: 0.4,
    emissive: "#10B981",
    emissiveIntensity: 0.1
  });
  const materialT = new THREE.MeshStandardMaterial({ 
    color: "#3B82F6", // Blue
    metalness: 0.3,
    roughness: 0.4,
    emissive: "#3B82F6",
    emissiveIntensity: 0.1
  });
  const materialC = new THREE.MeshStandardMaterial({ 
    color: "#8B5CF6", // Purple
    metalness: 0.3,
    roughness: 0.4,
    emissive: "#8B5CF6",
    emissiveIntensity: 0.1
  });
  const materialG = new THREE.MeshStandardMaterial({ 
    color: "#F59E0B", // Orange
    metalness: 0.3,
    roughness: 0.4,
    emissive: "#F59E0B",
    emissiveIntensity: 0.1
  });

  React.useEffect(() => {
    const group = groupRef.current;
    const step = 0.3;
    const angleStep = 0.15;

    for (let i = 0; i < length; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * 1.5;
      const y = i * step;
      const z = Math.sin(angle) * 1.5;

      const geometry = new THREE.SphereGeometry(0.15, 8, 8);

      const basePair = i % 4;

      const meshA = new THREE.Mesh(
        geometry,
        basePair === 0
          ? materialA
          : basePair === 1
            ? materialT
            : basePair === 2
              ? materialC
              : materialG
      );
      meshA.position.set(x, y, z);

      const meshB = new THREE.Mesh(
        geometry,
        basePair === 0
          ? materialT
          : basePair === 1
            ? materialA
            : basePair === 2
              ? materialG
              : materialC
      );
      meshB.position.set(-x, y, -z);

      group.add(meshA);
      group.add(meshB);
    }
  }, [length, materialA, materialT, materialC, materialG]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return <group ref={groupRef}></group>;
};

const FloatingParticles = () => {
  const particlesRef = React.useRef();
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() * 0.02;
      const x = Math.random() * 10 - 5;
      const y = Math.random() * 10 - 5;
      const z = Math.random() * 10 - 5;
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      particle.time += particle.speed;
      const mesh = particlesRef.current.children[i];
      if (mesh) {
        mesh.position.x = particle.x + Math.sin(particle.time) * 0.5;
        mesh.position.y = particle.y + Math.cos(particle.time) * 0.5;
        mesh.position.z = particle.z + Math.sin(particle.time * 0.5) * 0.5;
        mesh.material.opacity = 0.3 + Math.sin(particle.time) * 0.2;
      }
    });
  });

  return (
    <group ref={particlesRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial 
            color="#10B981" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const TraderDNA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-xl" />
      <Canvas
        style={{
          height: "100%",
          background: "transparent",
          borderRadius: "0.75rem",
        }}
        camera={{ 
          position: [0, 0, 8], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#10B981" />
        
        <Helix />
        <FloatingParticles />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
      
      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <div className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            Trading DNA
          </div>
          <div className="text-sm text-gray-300 drop-shadow-lg">
            Your unique trading pattern
          </div>
        </motion.div>
      </div>
      
      {/* Corner Accent */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
    </motion.div>
  );
};

export default TraderDNA;
