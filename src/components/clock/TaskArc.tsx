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
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}

const ARC_INNER_RADIUS = 3.38;
const ARC_OUTER_RADIUS = 3.56;
const ARC_Y = 0.07;

export default function TaskArc({
  taskId,
  startTime,
  endTime,
  color,
  isCompleted,
  isHovered,
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
    const targetScale = isHovered ? 1.08 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      delta * 4
    );
    meshRef.current.scale.z = THREE.MathUtils.lerp(
      meshRef.current.scale.z,
      targetScale,
      delta * 4
    );

    // Hover lift (Gravitational Field)
    const targetY = isHovered ? ARC_Y + 0.15 : ARC_Y;
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

    // Use a TubeGeometry-like approach with extruded rounded shape
    const path: THREE.Vector3[] = [];
    const segments = 64;
    const midRadius = (ARC_INNER_RADIUS + ARC_OUTER_RADIUS) / 2;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = startAngle - animatedSweep * t;
      path.push(new THREE.Vector3(
        Math.cos(a) * midRadius,
        0,
        -Math.sin(a) * midRadius
      ));
    }

    // Create tube along the arc path
    const curve = new THREE.CatmullRomCurve3(path, false, 'catmullrom', 0);
    const tubeRadius = (ARC_OUTER_RADIUS - ARC_INNER_RADIUS) / 2;
    const geom = new THREE.TubeGeometry(curve, segments, tubeRadius, 8, false);
    return geom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, animProgress]);

  if (!geometry) return null;

    const displayColor = isCompleted ? '#475569' : color;
    const opacity = isCompleted ? 0.25 : 0.85;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, ARC_Y, 0]}
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
