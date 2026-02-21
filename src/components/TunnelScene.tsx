import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

// --- 1. DYNAMIC CONFIG: FILENAMES FROM YOUR SCREENSHOT ---
const VIDEO_FILES = [
  "vid1.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.26 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.27 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM (2).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.29 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.30 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.31 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.31 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.32 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM (2).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.34 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.34 PM (2).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.34 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.35 PM.mp4"
];

const generatePanels = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; 
    const depth = -5 - (i * 7); // Spaced out for 17 videos
    let pos: [number, number, number] = [0, 0, 0];
    
    if (side === 0) pos = [-7.9, 1.5, depth];    // Left
    if (side === 1) pos = [7.9, -1.5, depth + 2]; // Right
    if (side === 2) pos = [0, 6.9, depth + 4];    // Top
    if (side === 3) pos = [0, -6.9, depth + 1];   // Bottom

    return { url: `/${file}`, pos, scale: [5, 2.8] as [number, number] };
  });
};

const PANEL_DATA = generatePanels(VIDEO_FILES);

// --- 3D GRID ROOM SIDES ---
const TunnelRoom = () => {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 45); // Extended grid for more depth
    return tex;
  }, []);

  return (
    <group>
      <mesh position={[-8, 0, -60]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[160, 20]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[8, 0, -60]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[160, 20]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -7, -60]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[16, 160]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 7, -60]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[16, 160]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

const VideoPlane = ({ url, pos, scale }: any) => {
  const texture = useVideoTexture(url);
  const rotation: [number, number, number] = useMemo(() => {
    if (pos[0] < -5) return [0, Math.PI / 2, 0];
    if (pos[0] > 5) return [0, -Math.PI / 2, 0];
    if (pos[1] < -5) return [-Math.PI / 2, 0, 0];
    return [Math.PI / 2, 0, 0];
  }, [pos]);

  return (
    <mesh position={pos} rotation={rotation}>
      <planeGeometry args={scale} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
};

const CameraController = () => {
  const targetZ = useRef(4); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, -15);
    const handleWheel = (e: WheelEvent) => {
      // Increased range to -130 to accommodate all 17 panels
      targetZ.current = Math.max(-130, Math.min(8, targetZ.current - e.deltaY * 0.04));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

const CentralLogo = () => (
  <group position={[0, 0, -4]}>
    <Text
      fontSize={1.5}
      scale={[1.4, 1, 1]}
      color="#ffffff"
      fontWeight={800} 
      strokeWidth={0.03}
      strokeColor="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text
      fontSize={0.25}
      position={[0, -1.1, 0]}
      color="#ffffff"
      letterSpacing={0.5}
      anchorX="center"
      anchorY="middle"
    >
      FILMS
    </Text>
  </group>
);

export default function TunnelScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative" }}>
      <Canvas gl={{ antialias: true }} camera={{ fov: 75 }}>
        <Suspense fallback={null}>
          <CameraController />
          <TunnelRoom />
          <CentralLogo />

          {PANEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
              <VideoPlane {...panel} />
            </Float>
          ))}
          
          <fog attach="fog" args={["#000", 20, 120]} />
        </Suspense>
      </Canvas>

      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button style={{ 
          padding: '12px 40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', 
          backgroundColor: 'white', color: 'black', fontWeight: '900', cursor: 'pointer', fontSize: '11px' 
        }}>MENU</button>
      </div>
    </div>
  );
}