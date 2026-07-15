"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, Center } from "@react-three/drei";
import { useRef, useEffect } from "react";
import gsap from "gsap";

function BuildingModel() {
  const meshRef = useRef();

  // Gentle rotate animation (idle auto rotation)
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Base slab */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.15, 3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
      </mesh>
      
      {/* Lower Glass structure */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.5, 1.0, 2.2]} />
        <meshStandardMaterial color="#D4AF37" transparent opacity={0.3} roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* Inner Architectural Pillars */}
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}-${z}`} position={[x * 1.1, 0.2, z * 0.9]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1.0, 8]} />
            <meshStandardMaterial color="#111111" roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Middle Slab Divider */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.1, 2.4]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>

      {/* Upper cantilevered penthouse structure */}
      <mesh position={[0.3, 1.2, 0.2]} castShadow>
        <boxGeometry args={[1.8, 0.8, 1.6]} />
        <meshStandardMaterial color="#FAF9F6" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Modern overhang roof */}
      <mesh position={[0.2, 1.65, 0.2]} castShadow>
        <boxGeometry args={[2.2, 0.08, 2.0]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Luxury3DCanvas() {
  const containerRef = useRef();

  useEffect(() => {
    // Staggered cinematic zoom-in effect on load
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: "power4.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[500px] relative">
      <Canvas shadows camera={{ position: [4, 3, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[8, 12, 5]}
          intensity={1.8}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-6, 4, -4]} intensity={0.8} color="#D4AF37" />
        
        <Center>
          <BuildingModel />
        </Center>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
