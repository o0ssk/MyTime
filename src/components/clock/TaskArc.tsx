// ==========================================
// TaskArc — Orbital Glowing Arc
// ==========================================

'use client';

import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getArcAngles } from '@/lib/timeUtils';

interface TaskArcProps {
  taskId: string;
  startTime: number;
  endTime: number;
  color: string;
  isCompleted: boolean;
  isHovered: boolean;
  radius: number;
  y: number;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}

export default function TaskArc({
  taskId,
  startTime,
  endTime,
  color,
  isCompleted,
  isHovered,
  radius,
  y,
  onPointerOver,
  onPointerOut,
  onClick,
}: TaskArcProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [animProgress, setAnimProgress] = useState(0);

  useFrame((_, delta) => {
    if (animProgress < 1) {
      setAnimProgress((p) => Math.min(1, p + delta * 2.5));
    }

    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    // Smooth emissive transitions (Celestial Glow)
    const targetEmissive = isHovered ? 0.8 : isCompleted ? 0.05 : 0.3;
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      targetEmissive,
      delta * 4
    );

    // Hover scale (Ethereal Pulse)
    const targetScale = isHovered ? 1.05 : 1;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      delta * 4
    ));

    // Hover lift (Gravitational Field)
    const targetY = isHovered ? y + 0.1 : y;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      delta * 4
    );
  });

  const geometry = useMemo(() => {
    const { startAngle, sweep } = getArcAngles(startTime, endTime);
    const animatedSweep = sweep * Math.min(animProgress, 1);
    if (animatedSweep < 0.01) return null;

    const segments = 64;
    const path: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = startAngle - animatedSweep * t;
      path.push(new THREE.Vector3(
        Math.cos(a) * radius,
        0,
        -Math.sin(a) * radius
      ));
    }

    const curve = new THREE.CatmullRomCurve3(path, false, 'catmullrom', 0);
    // Fixed thickness for orbit arcs
    const tubeRadius = 0.04;
    const geom = new THREE.TubeGeometry(curve, segments, tubeRadius, 8, false);
    return geom;
  }, [startTime, endTime, animProgress, radius]);

  if (!geometry) return null;

  const displayColor = isCompleted ? '#475569' : color;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, y, 0]}
      castShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut();
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <meshStandardMaterial
        color={displayColor}
        emissive={displayColor}
        emissiveIntensity={isHovered ? 0.8 : 0.2} 
        metalness={0.9} 
        roughness={0.1} 
        transparent
        opacity={isCompleted ? 0.3 : 0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
