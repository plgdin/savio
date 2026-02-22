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

// --- "WIDE FUNNEL" ALGORITHM ---
const generateScatteredTheater = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; 
    
    // Z drops steadily behind the massive logo
    const zPos = -5 - (i * 3.5); 

    // WIDER QUARANTINE ZONE: Prevents videos from overlapping the huge logo
    const boundX = 14;  
    const boundY = 8.5;  

    const scatter1 = Math.sin(i * 13.7) * 4; 
    const scatter2 = Math.cos(i * 19.3) * 2; 

    // Exact Framer tilt angles
    const yAngle = 0.959; 
    const xAngle = 1.274; 
    const zTilt = Math.sin(i * 1.1) * 0.05; 

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];

    const w = 5.5 + (i % 3) * 0.8; 
    const h = w * 0.5625; 
    const targetScale: [number, number] = [w, h];

    if (side === 0) { // Left Wall
      pos = [-boundX - Math.abs(scatter2), scatter1, zPos]; 
      rot = [0, yAngle, zTilt]; 
    } 
    else if (side === 1) { // Right Wall
      pos = [boundX + Math.abs(scatter2), -scatter1, zPos]; 
      rot = [0, -yAngle, -zTilt]; 
    } 
    else if (side === 2) { // Top Ceiling
      pos = [scatter1 * 1.5, boundY + Math.abs(scatter2), zPos]; 
      rot = [xAngle, 0, zTilt]; 
    } 
    else { // Bottom Floor
      pos = [-scatter1 * 1.5, -boundY - Math.abs(scatter2), zPos]; 
      rot = [-xAngle, 0, -zTilt]; 
    }

    return { url: `/${file}`, pos, rot, targetScale };
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
      <mesh position={[-28, 0, -50]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[28, 0, -50]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, -20, -50]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[60, 400]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
      <mesh position={[0, 20, -50]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[60, 400]} /><meshBasicMaterial map={gridTexture} transparent opacity={0.15} /></mesh>
    </group>
  );
};

// --- ANIMATED "POP-IN" VIDEO PLANE ---
const VideoPlane = ({ url, pos, rot, targetScale, index }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a Vector3 for the target scale so we can smoothly animate to it
  const finalScale = useMemo(() => new THREE.Vector3(targetScale[0], targetScale[1], 1), [targetScale]);

  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      // Staggered Pop Animation: Delay based on index
      const delay = index * 0.08; 
      if (state.clock.elapsedTime > delay) {
        // Lerp scales the mesh up from 0 to its full size smoothly
        meshRef.current.scale.lerp(finalScale, 0.08);
      }
    }
  });

  return (
    // Initial scale is forced to [0,0,0] so they pop in on load
    <mesh ref={meshRef} position={pos} rotation={rot} scale={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} /> 
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

// --- CAMERA CONTROLLER ---
const CameraController = () => {
  const targetZ = useRef(10); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 10); // Start far back to see the massive logo
    const handleWheel = (e: WheelEvent) => {
      targetZ.current = Math.max(-120, Math.min(10, targetZ.current - e.deltaY * 0.08));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

// --- MAIN LOGO & HIDDEN DEEP TEXT ---
const TextCheckpoints = () => (
  <group>
    {/* 1. HUGE Initial Logo */}
    <group position={[0, 0, -12]}>
      <Image 
        url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
        scale={[24, 7]} // Made extremely large
        transparent
        toneMapped={false} 
      />
    </group>

    {/* 2. Hidden Text 1 (Swallowed by Fog until you scroll) */}
    <group position={[0, 0, -55]}>
      <Text fontSize={3} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">
        FEATURED WORK
      </Text>
      <Text fontSize={0.4} position={[0, -2, 0]} color="#aaaaaa" letterSpacing={0.5} anchorX="center" anchorY="middle">
        SCROLL DEEPER
      </Text>
    </group>

    {/* 3. Hidden Text 2 */}
    <group position={[0, 0, -95]}>
      <Text fontSize={3.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">
        OUR DIRECTORS
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

          {/* Videos with exact index passed down for staggered pop-in animation */}
          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
              <VideoPlane {...panel} index={i} />
            </Float>
          ))}
          
          {/* THE BLACK VOID FOG: Hides the deep text perfectly until you scroll into it */}
          <fog attach="fog" args={["#000", 25, 65]} />
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