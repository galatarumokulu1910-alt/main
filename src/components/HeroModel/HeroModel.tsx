import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import modelUrl from '../../assets/rumoku.glb?url';

function Model({ scale, ...props }: any) {
  const { scene } = useGLTF(modelUrl);

  React.useEffect(() => {
    scene.traverse((obj) => {
      obj.frustumCulled = false;
    });
  }, [scene]);

  return (
    <group scale={scale} {...props}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function HeroScene({ start = true }: { start?: boolean }) {
  const { size, camera } = useThree();
  const rotGroupRef = useRef<THREE.Group>(null);

  // Animation timing
  const accumulatedTimeRef = useRef(0);
  const frameCount = useRef(0);
  const WARMUP_FRAMES = 10; // 10 warm-up frames to cover shader upload

  // Camera positions (X=0 to prevent lateral snap/jumps)
  const introY = 22;
  const introZ = 200;
  const restY = 5;
  const restZ = 120;

  useEffect(() => {
    camera.position.set(0, introY, introZ);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;
  const modelScale = isMobile ? 0.7 : isTablet ? 1.0 : 1.25;

  // Calculate viewport width specifically at the camera's resting distance (restZ = 120)
  // to prevent posX from shifting when the camera zooms or when the component re-renders.
  const aspect = size.width / size.height;
  const fovRad = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360;
  const viewportWidthAtRest = 2 * Math.tan(fovRad) * restZ * aspect;

  const posX = isMobile ? 0 : isTablet ? viewportWidthAtRest * 0.18 : viewportWidthAtRest * 0.26;
  const posY = -0.5;

  useFrame((_, rawDelta) => {
    if (!start) {
      camera.position.set(0, introY, introZ);
      camera.lookAt(0, 0, 0);
      return;
    }

    frameCount.current++;

    // Warm-up: hold camera at intro position while GPU uploads geometry
    if (frameCount.current <= WARMUP_FRAMES) {
      camera.position.set(0, introY, introZ);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Clamp delta to prevent stutter from initial GPU load spikes
    const delta = Math.min(rawDelta, 0.02);

    // Accumulate time step-by-step to prevent skips/jumps
    accumulatedTimeRef.current += delta;
    const time = accumulatedTimeRef.current;

    // ── 1. Intro Fly-in (3.5s) — Y and Z animate, X stays centered ──
    const introDuration = 3.5;
    const t = Math.min(time / introDuration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // Cubic ease-out

    const camY = THREE.MathUtils.lerp(introY, restY, ease);
    const camZ = THREE.MathUtils.lerp(introZ, restZ, ease);

    // ── 2. Idle Cinematic drift: slow zoom-in & zoom-out (Z axis float) ──
    // Drift range ±3.5 units around the resting Z value, fading in smoothly with the intro
    const driftZ = Math.sin(time * 0.2) * 3.5 * ease;

    // Set camera position: X is always 0, Y follows fly-in, Z has fly-in + zoom float
    camera.position.set(0, camY, camZ + driftZ);

    // Keep camera focused strictly on center
    camera.lookAt(0, 0, 0);

    // ── 3. Very subtle auto-oscillation model sway (centered around -0.25 rad) ──
    if (rotGroupRef.current) {
      const baseRotationY = -0.25;
      const swayRange = 0.04; // ±2.3 degrees of sway
      rotGroupRef.current.rotation.y = baseRotationY + Math.sin(time * 0.3) * swayRange;
    }
  });

  return (
    <group position={[posX, posY, 0]}>
      {/* Building is statically rotated to face slightly right (opposite direction, -0.25 rad) */}
      <group ref={rotGroupRef} rotation={[0, -0.25, 0]}>
        <Model scale={modelScale} />
      </group>
    </group>
  );
}

useGLTF.preload(modelUrl);

export default function HeroModel({ start = true }: { start?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 22, 200], fov: 8, near: 0.1, far: 50000 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 12, 8]} intensity={1.2} color="#fff4e6" />
        <directionalLight position={[-5, -3, -8]} intensity={0.3} color="#d4a853" />
        
        <Environment preset="city" environmentIntensity={0.6} />
        
        <HeroScene start={start} />
        
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.5} 
          scale={50} 
          blur={2.5} 
          far={10} 
          color="#1a1a1a"
        />
      </Suspense>
    </Canvas>
  );
}
