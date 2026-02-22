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
    const side = i % 4; 
    const zPos = 2 - (i * 2.5); 

    const scatter1 = Math.sin(i * 13.7) * 7; 
    const scatter2 = Math.cos(i * 19.3) * 3; 

    // WIDER QUARANTINE ZONE: Pushed out to make room for the massive logo
    const boundX = 13.0;  
    const boundY = 7.5;  

    // Exact Framer CSS Rotation Angles
    const yAngle = 0.959; // 55 degrees 
    const xAngle = 1.274; // 73 degrees 
    const zTilt = Math.sin(i * 1.1) * 0.05; 

    let pos: [number, number, number] = [0, 0, 0];
    let rot: [number, number, number] = [0, 0, 0];

    const w = 4.5 + (i % 3) * 0.8; 
    const h = w * 0.5625; 
    const targetScale: [number, number] = [w, h];

    if (side === 0) { // Left
      pos = [-boundX - Math.abs(scatter2), scatter1, zPos]; 
      rot = [0, yAngle, zTilt]; 
    } 
    else if (side === 1) { // Right
      pos = [boundX + Math.abs(scatter2), -scatter1, zPos]; 
      rot = [0, -yAngle, -zTilt]; 
    } 
    else if (side === 2) { // Top 
      pos = [scatter1 * 1.5, boundY + Math.abs(scatter2), zPos]; 
      rot = [xAngle, 0, zTilt]; 
    } 
    else { // Bottom 
      pos = [-scatter1 * 1.5, -boundY - Math.abs(scatter2), zPos]; 
      rot = [-xAngle, 0, -zTilt]; 
    }

    return { url: `/${file}`, pos, rot, targetScale };
  });
};

const TUNNEL_DATA = generateScatteredTheater(VIDEO_FILES);

// --- FLASHBANG BACKGROUND & FOG CONTROLLER ---
const ThemeController = () => {
  const { scene } = useThree();
  const bgColor = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame((state) => {
    // Flashbang flip at 0.8 seconds
    const isDark = state.clock.elapsedTime > 0.8;
    const targetColor = new THREE.Color(isDark ? "#000000" : "#ffffff");
    
    bgColor.lerp(targetColor, 0.1);
    scene.background = bgColor;
    
    // Deep fog hides everything past the logo until you scroll
    if (!scene.fog) scene.fog = new THREE.Fog("#ffffff", 25, 60);
    scene.fog.color.copy(bgColor);
  });
  return null;
};

// --- FADING 3D GRID ROOM ---
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

  const matRefs = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame((state) => {
    const isDark = state.clock.elapsedTime > 0.8;
    matRefs.current.forEach(mat => {
      if (mat) mat.opacity = THREE.MathUtils.lerp(mat.opacity, isDark ? 0.15 : 0, 0.1);
    });
  });

  return (
    <group>
      <mesh position={[-25, 0, -50]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial ref={(el) => (matRefs.current[0] = el as any)} map={gridTexture} transparent opacity={0} /></mesh>
      <mesh position={[25, 0, -50]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[400, 40]} /><meshBasicMaterial ref={(el) => (matRefs.current[1] = el as any)} map={gridTexture} transparent opacity={0} /></mesh>
      <mesh position={[0, -18, -50]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[50, 400]} /><meshBasicMaterial ref={(el) => (matRefs.current[2] = el as any)} map={gridTexture} transparent opacity={0} /></mesh>
      <mesh position={[0, 18, -50]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[50, 400]} /><meshBasicMaterial ref={(el) => (matRefs.current[3] = el as any)} map={gridTexture} transparent opacity={0} /></mesh>
    </group>
  );
};

// --- EXPLODING VIDEO PLANE ---
const VideoPlane = ({ url, pos: targetPos, rot, targetScale, index }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  const isInit = useRef(false);
  
  const finalPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const finalScale = useMemo(() => new THREE.Vector3(targetScale[0], targetScale[1], 1), [targetScale]);
  
  // Starting point: Shoved directly behind the logo at z=-20
  const startPos = useMemo(() => new THREE.Vector3(0, 0, -20), []);
  const startScale = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      if (!isInit.current) {
        meshRef.current.position.copy(startPos);
        meshRef.current.scale.copy(startScale);
        isInit.current = true;
      }

      // Explosion trigger: Fires right after the screen goes black
      const delay = 0.9 + (index * 0.03); 
      if (state.clock.elapsedTime > delay) {
        meshRef.current.position.lerp(finalPos, 0.08); 
        meshRef.current.scale.lerp(finalScale, 0.08);  
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
  const targetZ = useRef(8); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 8); 
    const handleWheel = (e: WheelEvent) => {
      targetZ.current = Math.max(-150, Math.min(10, targetZ.current - e.deltaY * 0.08));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

// --- LOGO COLOR FLIP & HIDDEN DEEP TEXT ---
const TextCheckpoints = () => {
  const whiteLogoRef = useRef<THREE.Mesh>(null);
  const blackLogoRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const isDark = state.clock.elapsedTime > 0.8;
    if (whiteLogoRef.current && blackLogoRef.current) {
      (whiteLogoRef.current.material as THREE.Material).opacity = THREE.MathUtils.lerp((whiteLogoRef.current.material as THREE.Material).opacity, isDark ? 1 : 0, 0.2);
      (blackLogoRef.current.material as THREE.Material).opacity = THREE.MathUtils.lerp((blackLogoRef.current.material as THREE.Material).opacity, isDark ? 0 : 1, 0.2);
    }
  });

  return (
    <group>
      {/* 1. MASSIVE Center Logo (z = -20) */}
      <group position={[0, 0, -20]}>
        <Image ref={whiteLogoRef} scale={[22, 6.4]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#ffffff" />
        <Image ref={blackLogoRef} scale={[22, 6.4]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#000000" position={[0,0,0.01]} />
      </group>

      {/* 2. Hidden Text 1 (Swallowed by Fog at z=-80 until you scroll) */}
      <group position={[0, 0, -80]}>
        <Text fontSize={3} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">
          FEATURED WORK
        </Text>
        <Text fontSize={0.4} position={[0, -2, 0]} color="#aaaaaa" letterSpacing={0.5} anchorX="center" anchorY="middle">
          SCROLL DEEPER
        </Text>
      </group>

      {/* 3. Hidden Text 2 (End of tunnel) */}
      <group position={[0, 0, -130]}>
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
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <ThemeController />
          <CameraController />
          <TunnelRoom />
          <TextCheckpoints />

          {/* Videos stagger-explode outward from behind the logo */}
          {TUNNEL_DATA.map((panel, i) => (
            <Float key={i} speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
              <VideoPlane {...panel} index={i} />
            </Float>
          ))}
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