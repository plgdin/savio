import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom"; // <-- ROUTER IMPORT ADDED HERE

// --- DYNAMIC CONFIG ---
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
    const zPos = -5 - (depthStep * 12); 
    
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
      <mesh position={[-8, 0, -100]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[250, 20]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} /></mesh>
      <mesh position={[8, 0, -100]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[250, 20]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} /></mesh>
      <mesh position={[0, -7, -100]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[16, 250]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} /></mesh>
      <mesh position={[0, 7, -100]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[16, 250]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.3} /></mesh>
    </group>
  );
};

// --- GPU OPTIMIZED VIDEO PLANE ---
const VideoPlane = ({ url, pos, rot, scale }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  
  // This physically stops WebGL from duplicating the video into memory for mipmaps
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

// --- CRASH-PROOF LOGO (No Font URL) ---
const CentralLogo = () => (
  <group position={[0, 0, -4]}>
    <Text 
      fontSize={1.8} 
      scale={[1.5, 1, 1]} 
      color="#ffffff" 
      fontWeight={900}
      strokeWidth={0.03}
      strokeColor="#ffffff"
      anchorX="center" 
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text 
      fontSize={0.2} 
      position={[0, -1, 0]} 
      color="#ffffff" 
      letterSpacing={0.6}
      anchorX="center" 
      anchorY="middle"
    >
      FILMS
    </Text>
  </group>
);

export default function TunnelScene() {
  const navigate = useNavigate(); // <-- ROUTER HOOK INITIALIZED HERE

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <CameraController />
          <TunnelRoom />
          <CentralLogo />

          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.5} rotationIntensity={0.01} floatIntensity={0.02}>
              <VideoPlane {...panel} />
            </Float>
          ))}
          
          <fog attach="fog" args={["#000", 30, 200]} />
        </Suspense>
      </Canvas>

      {/* THE ONLY MENU BUTTON THAT SHOULD EXIST - NOW WIRED UP */}
      <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
        <button 
          onClick={() => navigate('/menu')} // <-- ONCLICK EVENT ADDED HERE
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