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

// --- "STRICT THEATER TUNNEL" ALGORITHM ---
// This permanently locks the center screen to be empty, matching Framer exactly.
const generateTheaterPanels = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; // 0: Left, 1: Right, 2: Top, 3: Bottom
    const depth = Math.floor(i / 4); // Rings of depth: 0, 1, 2, 3, 4
    
    // Stretch videos deep into the background (Z goes from 0 to -45)
    const zPos = 0 - (depth * 9) - (i % 2 === 0 ? 0 : 3);

    // The Framer Angle: ~32 degrees inward toward the viewer
    const angle = 0.55; 

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];
    const scale: [number, number] = [5.5, 3.1]; // Locked 16:9 ratio

    // STRICT BOUNDARIES: Videos cannot enter the middle grid
    if (side === 0) { 
      // Left Wall: Hard locked to X < -9
      pos = [-9 - (depth * 0.5), (i % 3) * 2 - 2, zPos]; 
      rot = [0, angle, 0]; 
    } 
    else if (side === 1) { 
      // Right Wall: Hard locked to X > 9
      pos = [9 + (depth * 0.5), -((i % 3) * 2 - 2), zPos]; 
      rot = [0, -angle, 0]; 
    } 
    else if (side === 2) { 
      // Top Ceiling: Hard locked to Y > 6
      pos = [(i % 3) * 3 - 3, 6 + (depth * 0.5), zPos]; 
      rot = [angle, 0, 0]; 
    } 
    else { 
      // Bottom Floor: Hard locked to Y < -6
      pos = [-((i % 3) * 3 - 3), -6 - (depth * 0.5), zPos]; 
      rot = [-angle, 0, 0]; 
    }

    return { url: `/${file}`, pos, rot, scale };
  });
};

const TUNNEL_DATA = generateTheaterPanels(VIDEO_FILES);

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
    {/* 1. Main Logo (Matches Initial Framer View) */}
    <group position={[0, 0, -20]}>
      <Image 
        url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
        scale={[11, 3.2]} 
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

          {/* Videos mathematically locked to the outer walls */}
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