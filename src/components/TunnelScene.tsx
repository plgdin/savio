import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

// --- 1. DYNAMIC CONFIG: 17 VIDEOS ---
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

const generateTunnelPanels = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; 
    const depthStep = Math.floor(i / 4);
    const zPos = -5 - (depthStep * 10); // Tighter packing to fill walls
    
    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];
    
    if (side === 0) { pos = [-7.9, 0, zPos]; rot = [0, Math.PI / 2, 0]; }
    else if (side === 1) { pos = [7.9, 0, zPos]; rot = [0, -Math.PI / 2, 0]; }
    else if (side === 2) { pos = [0, 6.9, zPos]; rot = [Math.PI / 2, 0, 0]; }
    else { pos = [0, -6.9, zPos]; rot = [-Math.PI / 2, 0, 0]; }

    return { url: `/${file}`, pos, rot, scale: [6, 3.5] as [number, number] };
  });
};

const TUNNEL_DATA = generateTunnelPanels(VIDEO_FILES);

// --- 3D GRID SIDES ---
const TunnelRoom = () => {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"; // Subtle grid like SS
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 80); 
    return tex;
  }, []);

  return (
    <group>
      <mesh position={[-8, 0, -80]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[300, 20]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[8, 0, -80]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[300, 20]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -7, -80]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[16, 300]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 7, -80]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[16, 300]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

const VideoPlane = ({ url, pos, rot, scale }: any) => {
  const texture = useVideoTexture(url);
  return (
    <mesh position={pos} rotation={rot}>
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
      targetZ.current = Math.max(-180, Math.min(8, targetZ.current - e.deltaY * 0.05));
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
      fontSize={1.8} 
      scale={[1.5, 1, 1]} 
      color="#ffffff" 
      font="https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff" // BEBAS NEUE extracted from tokens
      letterSpacing={0.02}
      anchorX="center" 
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text 
      fontSize={0.2} 
      position={[0, -1, 0]} 
      color="#ffffff" 
      font="https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff"
      letterSpacing={0.6}
      anchorX="center" 
      anchorY="middle"
    >
      FILMS
    </Text>
  </group>
);

export default function TunnelScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      
      {/* GLOW OVERLAY FROM TOKENS */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vh', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,0,238,0.05) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none'
      }} />

      <Canvas gl={{ antialias: true }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <CameraController />
          <TunnelRoom />
          <CentralLogo />

          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.5} rotationIntensity={0.01} floatIntensity={0.02}>
              <VideoPlane {...panel} />
            </Float>
          ))}
          
          <fog attach="fog" args={["#000", 25, 180]} />
        </Suspense>
      </Canvas>

      {/* MENU BUTTON - 20px SPACING FROM TOKENS */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button style={{ 
          padding: '12px 40px', borderRadius: '88px', border: 'none', 
          backgroundColor: 'white', color: 'black', fontWeight: '900', 
          cursor: 'pointer', fontSize: '12px', letterSpacing: '2px',
          boxShadow: '0 10px 30px rgba(0,0,238,0.2)' // Shadow using extracted color
        }}>MENU</button>
      </div>
    </div>
  );
}