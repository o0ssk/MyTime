// ==========================================
// ClockLabels — Minimal Hour Markers + Ticks
// Only 12, 3, 6, 9 as numbers; rest as ticks
// ==========================================

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { hourToAngle12 } from '@/lib/timeUtils';

const KEY_NUMBERS = [12, 3, 6, 9];
const ALL_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const NUMBER_RADIUS = 3.15;
const TICK_INNER = 3.52;
const TICK_OUTER = 3.72;
const MAJOR_TICK_INNER = 3.48;

function MinuteTicks() {
  const geometry = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue; // Skip hour positions
      const angle = (Math.PI / 2) - (i / 60) * Math.PI * 2;
      const innerR = TICK_INNER + 0.04;
      const outerR = TICK_OUTER - 0.06;
      points.push(
        Math.cos(angle) * innerR, 0, -Math.sin(angle) * innerR,
        Math.cos(angle) * outerR, 0, -Math.sin(angle) * outerR
      );
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#94a3b8" transparent opacity={0.15} />
    </lineSegments>
  );
}

function MajorTicks() {
  return (
    <group>
      {ALL_HOURS.map((hour) => {
        const angle = hourToAngle12(hour);
        // All 12 hours get the slightly longer, brighter major tick
        const inner = MAJOR_TICK_INNER;
        const outer = TICK_OUTER;
        const midR = (inner + outer) / 2;
        const length = outer - inner;
        const x = Math.cos(angle) * midR;
        const z = -Math.sin(angle) * midR;

        return (
          <mesh
            key={hour}
            position={[x, 0, z]}
            rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}
          >
            <boxGeometry args={[0.02, length, 0.01]} />
            <meshStandardMaterial
              color="#cbd5e1"
              emissive="#cbd5e1"
              emissiveIntensity={0.1}
              metalness={1.0}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ClockLabels() {
  return (
    <group position={[0, 0.06, 0]}>
      {/* All hour numbers: 1-12 */}
      {ALL_HOURS.map((num) => {
        const angle = hourToAngle12(num);
        const x = Math.cos(angle) * NUMBER_RADIUS;
        const z = -Math.sin(angle) * NUMBER_RADIUS;

        return (
          <Text
            key={num}
            position={[x, 0.012, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="#f8fafc"
            fillOpacity={0.8}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            letterSpacing={0.05}
          >
            {num.toString()}
          </Text>
        );
      })}

      {/* Minute tick lines */}
      <MinuteTicks />

      {/* Major + minor tick marks */}
      <MajorTicks />
    </group>
  );
}
