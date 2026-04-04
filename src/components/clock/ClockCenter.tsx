// ==========================================
// ClockCenter — Glowing Core with Time Display
// ==========================================

'use client';

import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export default function ClockCenter() {
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState('');

  useFrame((state) => {
    // Pulsing glow (Celestial Breathing)
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
    if (outerGlowRef.current) {
      const mat = outerGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }

    // Update time display (throttled to ~2fps)
    if (Math.floor(state.clock.elapsedTime * 2) % 1 === 0) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
      setTime(`${displayH}:${m.toString().padStart(2, '0')} ${period}`);
    }
  });

  return (
    <group position={[0, 0.08, 0]}>
      {/* Center core — brushed silver sphere */}
      <mesh ref={glowRef} castShadow>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial
          color="#cbd5e1"
          emissive="#cbd5e1"
          emissiveIntensity={0.2}
          metalness={1.0}
          roughness={0.1}
        />
      </mesh>

      {/* Outer glow ring — soft silver pulse */}
      <mesh ref={outerGlowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.01, 16, 64]} />
        <meshStandardMaterial
          color="#cbd5e1"
          emissive="#cbd5e1"
          emissiveIntensity={0.15}
          metalness={1.0}
          roughness={0.0}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Time display — floating HTML */}
      <Html
        position={[0, -0.55, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-manrope)',
            fontSize: '12px',
            fontWeight: 300,
            color: 'rgba(203, 213, 225, 0.9)',
            letterSpacing: '0.2em',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            userSelect: 'none',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(203, 213, 225, 0.1)',
          }}
        >
          {time}
        </div>
      </Html>
    </group>
  );
}
