import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture, Image } from "@react-three/drei"; 
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

// --- "EXACT FRAMER MATH" ALGORITHM ---
const generateScatteredTheater = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; // 0: Left, 1: Right, 2: Top, 3: Bottom
    
    // Z drops steadily from +2 to -45. Logo sits at -20.
    const zPos = 2 - (i * 2.5); 

    // Pseudo-random scatter using prime multipliers
    const scatter1 = Math.sin(i * 13.7) * 7; 
    const scatter2 = Math.cos(i * 19.3) * 3; 

    // THE QUARANTINE ZONE: Videos cannot enter the center screen
    const boundX = 9.5;  
    const boundY = 6.0;  

    // THE EXACT ANGLES STOLEN FROM FRAMER'S HTML (Converted to Radians)
    const yAngle = 0.959; // 55 degrees for Left/Right walls
    const xAngle = 1.274; // 73 degrees for Top/Bottom walls
    
    const zTilt = Math.sin(i * 1.1) * 0.05; // Slight organic rotation

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];

    // Perfect 16:9 Aspect Ratio enforcement with varied sizing
    const w = 4.5 + (i % 3) * 0.8; 
    const h = w * 0.5625; 
    const scale: [number, number] = [w, h];

    if (side === 0) { // Left Wall
      pos = [-boundX - Math.abs(scatter2), scatter1, zPos]; 
      rot = [0, yAngle, zTilt]; 
    } 
    else if (side === 1) { // Right Wall
      pos = [boundX + Math.abs(scatter2), -scatter1, zPos]; 
      rot = [0, -yAngle, -zTilt]; 
    } 
    else if (side === 2) { // Top Ceiling (Sky)
      pos = [scatter1 * 1.5, boundY + Math.abs(scatter2), zPos]; 
      rot = [xAngle, 0, zTilt]; 
    } 
    else { // Bottom Floor
      pos = [-scatter1 * 1.5, -boundY - Math.abs(scatter2), zPos]; 
      rot = [-xAngle, 0, -zTilt]; 
    }

    return { url: `/${file}`, pos, rot, scale };
  });
};

const TUNNEL_DATA = generateScatteredTheater(VIDEO_FILES);

// --- 3D GRID ROOM ---
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
    tex.repeat.set(1, 150); 
    return tex;
  }, []);

  return (
    <group>
      <mesh position={[-25, 0, -50]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[25, 0, -50]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, -18, -50]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[50, 400]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, 18, -50]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[50, 400]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
    </group>
  );
};

// --- GPU OPTIMIZED VIDEO PLANE ---
const VideoPlane = ({ url, pos, rot, scale }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  
  // Physically stops WebGL from crashing by preventing duplicate mipmaps
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

// --- CAMERA CONTROLLER ---
const CameraController = () => {
  const targetZ = useRef(8); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 8); // Start slightly pulled back
    const handleWheel = (e: WheelEvent) => {
      // Allows scrolling extremely deep to find the hidden text (-100 depth)
      targetZ.current = Math.max(-100, Math.min(10, targetZ.current - e.deltaY * 0.08));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

// --- MAIN LOGO & DEEP TEXT ELEMENTS ---
const TextCheckpoints = () => (
  <group>
    {/* 1. Main Logo (Matches Initial Framer View exactly at z = -20) */}
    <group position={[0, 0, -20]}>
      <Image 
        url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
        scale={[12, 3.5]} 
        transparent
        toneMapped={false} 
      />
    </group>

    {/* 2. Hidden Text Checkpoint 1 (Revealed when scrolling past the main logo) */}
    <group position={[0, 0, -50]}>
      <Text fontSize={2.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">
        FEATURED WORK
      </Text>
      <Text fontSize={0.3} position={[0, -1.8, 0]} color="#aaaaaa" letterSpacing={0.5} anchorX="center" anchorY="middle">
        SCROLL DEEPER
      </Text>
    </group>

    {/* 3. Hidden Text Checkpoint 2 (End of the tunnel) */}
    <group position={[0, 0, -85]}>
      <Text fontSize={3} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">
        OUR DIRECTORS
      </Text>
      <Text fontSize={0.4} position={[0, -2, 0]} color="#aaaaaa" letterSpacing={0.8} anchorX="center" anchorY="middle">
        THE VISIONARIES
      </Text>
    </group>
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
          <TextCheckpoints />

          {/* Videos mathematically scattered around the quarantine zone */}
          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
              <VideoPlane {...panel} />
            </Float>
          ))}
          
          {/* Deep fog allows the tunnel to fade out smoothly in the distance */}
          <fog attach="fog" args={["#000", 30, 150]} />
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