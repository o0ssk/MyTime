// ==========================================
// ClockFace — Multi-Layered Luxury 3D Disc
// ==========================================

'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ClockFace() {
  const rimRef = useRef<THREE.Mesh>(null);

  // Subtle rim shimmer (Atmospheric Pulse)
  useFrame((state) => {
    if (rimRef.current) {
      const mat = rimRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <group>
      {/* Layer 1: Base "Midnight Canvas" disc */}
      <mesh receiveShadow>
        <cylinderGeometry args={[4.0, 4.0, 0.08, 128]} />
        <meshStandardMaterial
          color="#0f172a" 
          metalness={0.2}
          roughness={0.9}
        />
      </mesh>

      {/* Layer 2: Smoked Glass Layer (Tonal Layering) */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[3.85, 3.85, 0.01, 128]} />
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.2}
          roughness={0.1}
          transparent
          opacity={0.4}
          envMapIntensity={1.2}
          transmission={0.2}
          thickness={0.05}
        />
      </mesh>

      {/* Outer rim — "Polished Silver" accent */}
      <mesh ref={rimRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <torusGeometry args={[4.0, 0.06, 32, 128]} />
        <meshStandardMaterial
          color="#cbd5e1"
          emissive="#cbd5e1"
          emissiveIntensity={0.2}
          metalness={1.0}
          roughness={0.1}
        />
      </mesh>

      {/* Signature Component: The Orbital Track (Celestial Glow) */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.48, 0.008, 12, 256]} />
        <meshStandardMaterial
          color="#cbd5e1" 
          transparent
          opacity={0.15}
          metalness={1.0}
          roughness={0.0}
        />
      </mesh>
    </group>
  );
}
