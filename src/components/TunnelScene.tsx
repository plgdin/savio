import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, useVideoTexture, Image } from "@react-three/drei"; // Text removed, no more double FILMS
import * as THREE from "three";
import { useNavigate } from "react-router-dom"; 

// --- DYNAMIC CONFIG: 18 VIDEOS ---
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

// --- "THEATER TUNNEL" ALGORITHM ---
const generateTheaterPanels = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; // 0: Left, 1: Right, 2: Top, 3: Bottom
    
    // Spread videos continuously down the tunnel, wrapping past the logo
    const zPos = 2 - (i * 2.5);

    // STRICT HOLLOW CENTER: Pushes videos far out to the edges
    const xDist = 9.5 + (i % 3) * 1.5; // Distances: 9.5, 11, 12.5
    const yDist = 6.5 + (i % 2) * 1.5; // Distances: 6.5, 8.0

    // Organic scatter along the walls so they don't form perfect grids
    const xScatter = Math.sin(i * 2.2) * 6; // Slides Top/Bottom panels horizontally
    const yScatter = Math.cos(i * 3.1) * 4; // Slides Left/Right panels vertically

    // The Framer Angle: ~34 degrees (0.6 rad) inward toward the viewer
    const angle = 0.6; 
    const zTilt = Math.sin(i * 1.5) * 0.05; // Tiny natural rotation

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];

    // Perfect 16:9 Aspect Ratio enforcement
    const w = 5.5 + (i % 3); 
    const h = w * 0.5625; 
    const scale: [number, number] = [w, h];

    if (side === 0) { // Left Wall
      pos = [-xDist, yScatter, zPos]; 
      rot = [0, angle, zTilt]; 
    } 
    else if (side === 1) { // Right Wall
      pos = [xDist, yScatter, zPos]; 
      rot = [0, -angle, -zTilt]; 
    } 
    else if (side === 2) { // Top Ceiling
      pos = [xScatter, yDist, zPos]; 
      rot = [angle, 0, zTilt]; 
    } 
    else { // Bottom Floor
      pos = [xScatter, -yDist, zPos]; 
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
    tex.repeat.set(1, 100); 
    return tex;
  }, []);

  return (
    <group>
      {/* Pushed the walls out wider to accommodate the outer screens */}
      <mesh position={[-20, 0, -100]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[300, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[20, 0, -100]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[300, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, -14, -100]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[40, 300]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, 14, -100]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[40, 300]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
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
  const targetZ = useRef(5); // Starts slightly pulled back
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
    const handleWheel = (e: WheelEvent) => {
      // Allows scrolling deep past the logo
      targetZ.current = Math.max(-45, Math.min(8, targetZ.current - e.deltaY * 0.06));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

// --- THE LOGO AT THE END OF THE TUNNEL ---
const CentralLogo = () => (
  // Sits cleanly in the middle at z = -20
  <group position={[0, 0, -20]}>
    <Image 
      url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
      scale={[13, 3.8]} // Corrected aspect ratio to stop the squished look
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
          
          <fog attach="fog" args={["#000", 25, 200]} />
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