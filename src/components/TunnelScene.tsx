import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture, Image } from "@react-three/drei"; // <-- Image imported here
import * as THREE from "three";
import { useNavigate } from "react-router-dom"; 

// --- DYNAMIC CONFIG: ALL 18 VIDEOS ---
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

// --- "CONTROLLED CHAOS" GENERATOR (Matches Framer Screenshot) ---
const generatePseudoRandomPanels = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; 
    
    // Z-Depth: Pushes back steadily, bumps organically
    const zPos = -8 - (i * 4.5) + (Math.sin(i * 14.3) * 3.5); 

    // X/Y Offsets: Creates the scattered collage look
    const xOffset = Math.sin(i * 2.7) * 2.5; 
    const yOffset = Math.cos(i * 3.1) * 2.0;

    // The Framer Angle: ~35 degrees (0.6 rad) inward
    const baseAngle = 0.6 + (Math.sin(i * 5.5) * 0.15); 
    const zTilt = Math.sin(i * 7.2) * 0.1; 

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];

    // Scale: Varies size but strictly locks 16:9 ratio
    const width = 5.5 + (Math.sin(i * 8.4) * 1.2);
    const height = width * 0.56; 
    const scale: [number, number] = [width, height];

    if (side === 0) { // Left Wall
      pos = [-8.5 + xOffset, yOffset, zPos]; 
      rot = [0, baseAngle, zTilt]; 
    } 
    else if (side === 1) { // Right Wall
      pos = [8.5 + xOffset, yOffset, zPos]; 
      rot = [0, -baseAngle, -zTilt]; 
    } 
    else if (side === 2) { // Ceiling
      pos = [xOffset, 6.5 + yOffset, zPos]; 
      rot = [baseAngle, 0, zTilt]; 
    } 
    else { // Floor
      pos = [xOffset, -6.5 + yOffset, zPos]; 
      rot = [-baseAngle, 0, -zTilt]; 
    }

    return { url: `/${file}`, pos, rot, scale };
  });
};

const TUNNEL_DATA = generatePseudoRandomPanels(VIDEO_FILES);

// --- 3D GRID BACKGROUND ---
const TunnelRoom = () => {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 100); 
    return tex;
  }, []);

  return (
    <group>
      <mesh position={[-14, 0, -100]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[250, 30]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.2} /></mesh>
      <mesh position={[14, 0, -100]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[250, 30]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.2} /></mesh>
      <mesh position={[0, -10, -100]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[28, 250]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.2} /></mesh>
      <mesh position={[0, 10, -100]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[28, 250]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.2} /></mesh>
    </group>
  );
};

// --- GPU OPTIMIZED VIDEO PLANE ---
const VideoPlane = ({ url, pos, rot, scale }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  
  // Stops WebGL from crashing your GPU
  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh position={pos} rotation={rot}>
      <planeGeometry args={scale} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const CameraController = () => {
  const targetZ = useRef(4); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, -15);
    const handleWheel = (e: WheelEvent) => {
      targetZ.current = Math.max(-200, Math.min(8, targetZ.current - e.deltaY * 0.06));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

// --- EXACT FRAMER SVG LOGO ---
const CentralLogo = () => (
  <group position={[0, 0, -4]}>
    {/* The broken stencil SVG pulled directly from Framer */}
    <Image 
      url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
      scale={[8, 2.5]} 
      transparent
      toneMapped={false} 
    />
    
    <Text 
      fontSize={0.25} 
      position={[0, -1.6, 0]} 
      color="#ffffff" 
      letterSpacing={0.6}
      anchorX="center" 
      anchorY="middle"
      fontWeight={800}
    >
      FILMS
    </Text>
  </group>
);

export default function TunnelScene() {
  const navigate = useNavigate(); // <-- ROUTER HOOK

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <CameraController />
          <TunnelRoom />
          <CentralLogo />

          {/* Render the math-based staggered panels */}
          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.8} rotationIntensity={0.05} floatIntensity={0.1}>
              <VideoPlane {...panel} />
            </Float>
          ))}
          
          <fog attach="fog" args={["#000", 25, 180]} />
        </Suspense>
      </Canvas>

      {/* WIRED MENU BUTTON */}
      <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
        <button 
          onClick={() => navigate('/menu')} 
          style={{ 
            padding: '12px 45px', borderRadius: '88px', border: 'none', 
            backgroundColor: 'white', color: 'black', fontWeight: '900', 
            cursor: 'pointer', fontSize: '12px', letterSpacing: '2px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>MENU</button>
      </div>
    </div>
  );
}