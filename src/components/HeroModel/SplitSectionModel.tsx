import React, { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center, ContactShadows } from '@react-three/drei';
import modelUrl from '../../assets/rumoku.glb?url';

function SplitModel({ scale, ...props }: any) {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  React.useEffect(() => {
    clonedScene.traverse((obj) => {
      obj.frustumCulled = false;
    });
  }, [clonedScene]);

  return (
    <group scale={scale} {...props}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function SplitScene({ isVisible, onZoomComplete }: { isVisible: boolean; onZoomComplete: () => void }) {
  const { size, camera } = useThree();
  const zoomDone = useRef(false);
  const startZ = 600; // Start far away
  const endZ = 120;   // End at normal position
  const duration = 2.5; // seconds
  const elapsed = useRef(0);

  useEffect(() => {
    if (!isVisible) {
      zoomDone.current = false;
      elapsed.current = 0;
      camera.position.set(0, 5, startZ);
      camera.lookAt(0, 0, 0);
    }
  }, [isVisible, camera]);

  const modelScale = size.width < 768 ? 0.9 : size.width < 1024 ? 1.3 : 1.7;

  // Camera zoom-in animation
  useFrame((_, delta) => {
    if (!isVisible) return;
    if (zoomDone.current) return;

    elapsed.current += delta;
    const t = Math.min(elapsed.current / duration, 1);
    // Ease out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - t, 3);

    camera.position.z = startZ + (endZ - startZ) * eased;
    camera.lookAt(0, 0, 0);

    if (t >= 1) {
      zoomDone.current = true;
      camera.position.z = endZ;
      onZoomComplete();
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      <SplitModel scale={modelScale} />
    </group>
  );
}

const floorPins = [
  { top: '20%', left: '58%', label: 'Teras & Restoran', sub: 'Terrace & Restaurant' },
  { top: '31%', label: 'Kütüphane, Arşiv & Ofisler', sub: 'Library, Archive & Offices' },
  { top: '40%', label: 'Sergi Salonu & Fuaye', sub: 'Exhibition Hall & Foyer', imageUrl: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/idso4ws063_1773084000348.webp' },
  { top: '49%', label: 'Sergi Salonu & Fuaye', sub: 'Exhibition Hall & Foyer', imageUrl: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/8ybtmxvco0n_1773149574254.webp' },
  { top: '58%', label: 'Sergi Salonu & Çok Amaçlı Salon', sub: 'Exhibition Hall & Multipurpose Hall', imageUrl: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp' },
  { top: '69%', left: '58%', label: 'Giriş Fuaye & Kafe', sub: 'Entrance Foyer & Cafe', imageUrl: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mvoo9igr0vn_1773084176171.webp' },
];

export default function SplitSectionModel({ isVisible }: { isVisible?: boolean }) {
  const [pinsVisible, setPinsVisible] = useState<boolean[]>(new Array(floorPins.length).fill(false));
  const [zoomDone, setZoomDone] = useState(false);
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom state and hide pins immediately when section scrolls out of view
  useEffect(() => {
    if (!isVisible) {
      setZoomDone(false);
      setPinsVisible(new Array(floorPins.length).fill(false));
    }
  }, [isVisible]);

  // After zoom completes, reveal pins one by one from BOTTOM to TOP
  useEffect(() => {
    if (!zoomDone) return;
    
    const timeoutIds: number[] = [];
    const reversed = [...floorPins].map((_, i) => floorPins.length - 1 - i);
    
    reversed.forEach((pinIndex, seqIndex) => {
      const id = window.setTimeout(() => {
        setPinsVisible(prev => {
          const next = [...prev];
          next[pinIndex] = true;
          return next;
        });
      }, seqIndex * 250); // 250ms stagger between each pin
      timeoutIds.push(id);
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [zoomDone]);

  const handleZoomComplete = useCallback(() => {
    setZoomDone(true);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 5, 600], fov: 8, near: 0.1, far: 50000 }}
        style={{
          width: '100%',
          height: '100%',
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

          <SplitScene isVisible={!!isVisible} onZoomComplete={handleZoomComplete} />

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

      {/* Pinpoint overlay */}
      <div className="split-pins" style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}>
        {floorPins.map((pin, i) => (
          <div
            key={i}
            className={`split-pin ${pinsVisible[i] ? 'split-pin--visible' : ''}`}
            onMouseEnter={() => pin.imageUrl && setOverlayUrl(pin.imageUrl)}
            onMouseLeave={() => setOverlayUrl(null)}
            style={{
              position: 'absolute',
              top: pin.top,
              left: pin.left || '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              pointerEvents: 'auto',
            }}
          >
            <div className="split-pin__dot" />
            <div className="split-pin__label">
              <span className="split-pin__title">{pin.label}</span>
              <span className="split-pin__sub">{pin.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen high-res preview overlay rendered at document.body level using Portal */}
      {typeof document !== 'undefined' && createPortal(
        <div className={`split-photo-overlay ${overlayUrl ? 'split-photo-overlay--active' : ''}`}>
          {overlayUrl && <img src={overlayUrl} alt="Venue Preview" className="split-photo-overlay__img" />}
        </div>,
        document.body
      )}
    </div>
  );
}
