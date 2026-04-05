// ==========================================
// Clock3D — Canvas Wrapper (v2)
// ==========================================

'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ClockScene from './ClockScene';

function LoadingFallback() {
  return (
    <mesh>
      <torusGeometry args={[2, 0.04, 16, 64]} />
      <meshStandardMaterial
        color="#cbd5e1"
        emissive="#cbd5e1"
        emissiveIntensity={0.5}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export default function Clock3D() {
  const [mounted, setMounted] = React.useState(false);
  const [fov, setFov] = React.useState(35);

  React.useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      // More aggressive FOV for mobile to ensure fitting
      setFov(window.innerWidth < 768 ? 55 : 35);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none p-4">
      <div className="relative w-full h-full max-w-[min(90vw,900px)] aspect-square pointer-events-auto">
        {mounted && (
          <Canvas
            shadows
            camera={{
              position: [0, 5, window.innerWidth < 768 ? 16 : 12],
              fov: fov,
              near: 0.1,
              far: 100,
            }}
            resize={{ scroll: false }}
            gl={{
              antialias: true,
              alpha: true,
              stencil: false,
              depth: true,
              toneMapping: 3, // ACESFilmicToneMapping
              toneMappingExposure: 1.5,
            }}
            dpr={[1, 2]}
            onCreated={({ gl, camera }) => {
              gl.setClearAlpha(0);
              camera.lookAt(0, 0, 0);
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ClockScene />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  );
}
