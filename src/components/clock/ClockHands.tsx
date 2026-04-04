// ==========================================
// ClockHands — Ultra-Thin Premium Hands
// ==========================================

'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function createHandShape(
  length: number,
  baseWidth: number,
  tipWidth: number,
  tailLength: number
): THREE.Shape {
  const shape = new THREE.Shape();
  // Move to the very bottom of the tail
  shape.moveTo(-baseWidth * 0.2, -tailLength);
  shape.lineTo(baseWidth * 0.2, -tailLength);
  shape.lineTo(baseWidth * 0.5, 0);
  shape.lineTo(tipWidth, length);
  shape.lineTo(-tipWidth, length);
  shape.lineTo(-baseWidth * 0.5, 0);
  shape.closePath();
  return shape;
}

function Hand({
  length,
  baseWidth,
  tipWidth,
  tailLength,
  depth,
  color,
  emissive,
  emissiveIntensity,
  getRotation,
  metalness = 0.7,
  roughness = 0.2,
}: {
  length: number;
  baseWidth: number;
  tipWidth: number;
  tailLength: number;
  depth: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  getRotation: () => number;
  metalness?: number;
  roughness?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const shape = createHandShape(length, baseWidth, tipWidth, tailLength);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    });
    // No translation needed here if createHandShape handles the pivot at 0,0
    return geom;
  }, [length, baseWidth, tipWidth, tailLength, depth]);

  useFrame(() => {
    if (!meshRef.current) return;
    const angle = getRotation();
    meshRef.current.rotation.z = angle;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 0.1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    >
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function ClockHands() {
  const getHourRotation = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // Exact user formula for accurate angle
    return -((hours % 12 + minutes / 60 + seconds / 3600) * Math.PI / 6);
  };

  const getMinuteRotation = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // Exact user formula
    return -((minutes + seconds / 60) * Math.PI / 30);
  };

  const getSecondRotation = () => {
    const now = new Date();
    const seconds = now.getSeconds();
    const millis = now.getMilliseconds();
    // Exact user formula: (seconds * 6 deg converted to rad)
    // We additive sub-second milliseconds for silky smoothness as implied by "real-time" and "smooth"
    return -((seconds + millis / 1000) * Math.PI / 30);
  };

  return (
    <group>
      {/* Hour hand — short, bold, brushed silver */}
      <Hand
        length={2.2}
        baseWidth={0.12}
        tipWidth={0.04}
        tailLength={0.4}
        depth={0.06}
        color="#cbd5e1"
        emissive="#cbd5e1"
        emissiveIntensity={0.1}
        getRotation={getHourRotation}
        metalness={1.0}
        roughness={0.1}
      />

      {/* Minute hand — long, tapered, polished bright silver */}
      <Hand
        length={3.2}
        baseWidth={0.08}
        tipWidth={0.02}
        tailLength={0.5}
        depth={0.04}
        color="#f8fafc"
        emissive="#f8fafc"
        emissiveIntensity={0.05}
        getRotation={getMinuteRotation}
        metalness={1.0}
        roughness={0.05}
      />

      {/* Second hand — ultra-fine, needle-like, polished steel */}
      <Hand
        length={3.5}
        baseWidth={0.02}
        tipWidth={0.005}
        tailLength={0.7}
        depth={0.02}
        color="#94a3b8"
        emissive="#94a3b8"
        emissiveIntensity={0.25}
        getRotation={getSecondRotation}
        metalness={1.0}
        roughness={0.0}
      />
    </group>
  );
}
