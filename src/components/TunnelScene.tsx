import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, useVideoTexture, Image } from "@react-three/drei"; 
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

// --- "DEEP THEATER TUNNEL" ALGORITHM ---
const generateTheaterPanels = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; // 0: Left, 1: Right, 2: Top, 3: Bottom
    
    // Stretch videos DEEP into the background (from z=4 down to z=-70)
    const zPos = 4 - (i * 4.2);

    // Push panels out to form a strict, hollow rectangular box
    const X_WALL = 12;
    const Y_WALL = 7.5;

    // Organic scatter along the walls so it doesn't look like a perfect grid
    const scatter = Math.sin(i * 2.7) * 4;

    // The Framer Angle: ~30 degrees (0.5 rad) inward toward the viewer
    const angle = 0.5; 
    const zTilt = Math.sin(i * 1.5) * 0.05; 

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];

    // Perfect 16:9 Aspect Ratio enforcement
    const w = 5.5 + (i % 3) * 0.5; 
    const h = w * 0.5625; 
    const scale: [number, number] = [w, h];

    if (side === 0) { // Left Wall
      pos = [-X_WALL, scatter, zPos]; 
      rot = [0, angle, zTilt]; 
    } 
    else if (side === 1) { // Right Wall
      pos = [X_WALL, -scatter, zPos]; 
      rot = [0, -angle, -zTilt]; 
    } 
    else if (side === 2) { // Top Ceiling
      pos = [scatter, Y_WALL, zPos]; 
      rot = [angle, 0, zTilt]; 
    } 
    else { // Bottom Floor
      pos = [-scatter, -Y_WALL, zPos]; 
      rot = [-angle, 0, -zTilt]; 
    }

    return { url: `/${file}`, pos, rot, scale };
  });
};

const TUNNEL_DATA = generateTheaterPanels(VIDEO_FILES);

// --- 3D GRID ROOM (The Theater Box) ---
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
    tex.repeat.set(1, 150); // Deep grid
    return tex;
  }, []);

  return (
    <group>
      <mesh position={[-20, 0, -50]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[20, 0, -50]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, -15, -50]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[40, 400]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, 15, -50]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[40, 400]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
    </group>
  );
};

// --- GPU OPTIMIZED VIDEO PLANE ---
const VideoPlane = ({ url, pos, rot, scale }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  
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
  const targetZ = useRef(8); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 8);
    const handleWheel = (e: WheelEvent) => {
      // Increased scroll depth to -80 so you can fly past the logo into the back videos
      targetZ.current = Math.max(-80, Math.min(10, targetZ.current - e.deltaY * 0.08));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

// --- THE LOGO ---
const CentralLogo = () => (
  // Sits cleanly in the middle at z = -25 (Half the videos are in front, half are behind)
  <group position={[0, 0, -25]}>
    <Image 
      url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
      scale={[12, 3.5]} 
      transparent
      toneMapped={false} 
    />
  </group>
);

export default function TunnelScene() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <CameraController />
          <TunnelRoom />
          <CentralLogo />

          {/* Render the hollow theater panels */}
          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.8} rotationIntensity={0.03} floatIntensity={0.05}>
              <VideoPlane {...panel} />
            </Float>
          ))}
          
          {/* Fog pushed back so you can see the deeper videos */}
          <fog attach="fog" args={["#000", 30, 120]} />
        </Suspense>
      </Canvas>

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