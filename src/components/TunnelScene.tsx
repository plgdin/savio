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

// --- EXACT FRAMER GEOMETRY ---
const generateScatteredTheater = (files: string[]) => {
  return files.map((file, i) => {
    const side = i % 4; // 0: Left, 1: Right, 2: Top, 3: Bottom
    
    const zPos = -5 - (i * 3); // Deep tunnel
    
    // Quarantine boundaries so they NEVER hit the central logo
    const boundX = 11;  
    const boundY = 7;  

    const scatter1 = Math.sin(i * 13.7) * 4; 
    const scatter2 = Math.cos(i * 19.3) * 2; 

    // The Exact Framer CSS Rotation Angles
    const yAngle = 0.959; // 55 deg
    const xAngle = 1.274; // 73 deg
    const zTilt = Math.sin(i * 1.1) * 0.05; 

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];

    const w = 4.5 + (i % 3) * 0.8; 
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

    // Passing 'side' down so the animation knows which edge to fly in from
    return { url: `/${file}`, pos, rot, targetScale, side };
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

// --- ANIMATED "FLY-IN" VIDEO PLANE ---
const VideoPlane = ({ url, pos: targetPos, rot, targetScale, index, side }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  const isInitialized = useRef(false);
  
  const finalPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
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
      // 1. Initial State: Force videos WAY off-screen and scaled down to 0.4 (just like Framer HTML)
      if (!isInitialized.current) {
        const startX = side === 0 ? targetPos[0] - 40 : side === 1 ? targetPos[0] + 40 : targetPos[0];
        const startY = side === 2 ? targetPos[1] + 40 : side === 3 ? targetPos[1] - 40 : targetPos[1];
        meshRef.current.position.set(startX, startY, targetPos[2]);
        meshRef.current.scale.set(targetScale[0] * 0.4, targetScale[1] * 0.4, 1);
        isInitialized.current = true;
      }

      // 2. The Animation: Wait 0.6 seconds for Logo to pop, then stagger the videos flying in
      const delay = 0.6 + (index * 0.04); 
      if (state.clock.elapsedTime > delay) {
        meshRef.current.position.lerp(finalPos, 0.06); // Flies inward
        meshRef.current.scale.lerp(finalScale, 0.06);  // Scales up to 1.0
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={rot}>
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
    camera.position.set(0, 0, 10); 
    const handleWheel = (e: WheelEvent) => {
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

// --- LOGO POP & HIDDEN DEEP TEXT ---
const TextCheckpoints = () => {
  const logoGroupRef = useRef<THREE.Group>(null);
  const finalLogoScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame(() => {
    if (logoGroupRef.current) {
      // The Logo pops into existence immediately
      logoGroupRef.current.scale.lerp(finalLogoScale, 0.08);
    }
  });

  return (
    <group>
      {/* 1. Main Logo (Starts at scale 0, pops to full size) */}
      <group position={[0, 0, -20]} ref={logoGroupRef} scale={[0, 0, 0]}>
        <Image 
          url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
          scale={[16, 4.6]} 
          transparent
          toneMapped={false} 
        />
      </group>

      {/* 2. Hidden Text 1 (Swallowed by Fog at z=-65 until you scroll) */}
      <group position={[0, 0, -65]}>
        <Text fontSize={3} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">
          FEATURED WORK
        </Text>
        <Text fontSize={0.4} position={[0, -2, 0]} color="#aaaaaa" letterSpacing={0.5} anchorX="center" anchorY="middle">
          SCROLL DEEPER
        </Text>
      </group>

      {/* 3. Hidden Text 2 (End of tunnel) */}
      <group position={[0, 0, -95]}>
        <Text fontSize={3.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">
          OUR DIRECTORS
        </Text>
      </group>
    </group>
  );
};

export default function TunnelScene() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <CameraController />
          <TunnelRoom />
          <TextCheckpoints />

          {/* Render the Animated Fly-In Panels */}
          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
              <VideoPlane {...panel} index={i} />
            </Float>
          ))}
          
          {/* THE BLACK VOID: Hides anything past Z = -65 from the starting camera */}
          <fog attach="fog" args={["#000", 25, 75]} />
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