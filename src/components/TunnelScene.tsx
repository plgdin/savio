import React, { Suspense, useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture, Image } from "@react-three/drei"; 
import * as THREE from "three";
import { useNavigate } from "react-router-dom"; 

// --- DYNAMIC CONFIG: 16 VIDEOS (4 Per Wall to guarantee perfect framing) ---
const VIDEO_FILES = [
  "vid1.mp4", "WhatsApp Video 2026-02-21 at 3.00.26 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.27 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.28 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM (2).mp4", "WhatsApp Video 2026-02-21 at 3.00.28 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.29 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.30 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.31 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.31 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.32 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.33 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM (2).mp4", "WhatsApp Video 2026-02-21 at 3.00.33 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.34 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.34 PM (2).mp4"
];

// --- FLASHBANG & FOG CONTROLLER ---
const ThemeController = ({ isDark }: { isDark: boolean }) => {
  const { scene } = useThree();
  const bgColor = useMemo(() => new THREE.Color("#ffffff"), []);
  
  useFrame(() => {
    const targetColor = new THREE.Color(isDark ? "#000000" : "#ffffff");
    bgColor.lerp(targetColor, 0.15); // Snappy lerp for flashbang
    scene.background = bgColor;
    
    // Tense fog starting close to hide deep text until you scroll
    if (!scene.fog) scene.fog = new THREE.Fog("#ffffff", 20, 70);
    scene.fog.color.copy(bgColor);
  });
  return null;
};

// --- ANIMATED FLY-OUT VIDEO PLANE (Locked to Grid) ---
const VideoPlane = ({ url, targetPos, targetScale, index }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  const isInit = useRef(false);
  
  const finalPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const finalScale = useMemo(() => new THREE.Vector3(targetScale[0], targetScale[1], 1), [targetScale]);
  
  // They start clumped in the vanishing point at scale 0
  const startPos = useMemo(() => new THREE.Vector3(targetPos[0] * 0.1, targetPos[1] * 0.1, 0.1), [targetPos]);
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

      // Explosion trigger: Fires 0.9s after load, exploding outward along the grid
      const delay = 0.9 + (index * 0.03); 
      if (state.clock.elapsedTime > delay) {
        meshRef.current.position.lerp(finalPos, 0.08); 
        meshRef.current.scale.lerp(finalScale, 0.08);  
      }
    }
  });

  return (
    // Z is locked to 0.1 so it hovers EXACTLY on top of the wireframe lines forever
    <mesh ref={meshRef} position={[0, 0, 0.1]}>
      <planeGeometry args={[1, 1]} /> 
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

// --- PHYSICAL 3D WIREFRAME WALL ---
const WallGroup = ({ position, rotation, videos, isDark, startIndex }: any) => {
  // Generate a mathematically perfect grid texture to replace the fake SVG
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 512, 512); 
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 16); 
    return tex;
  }, []);

  const gridMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (gridMatRef.current) {
      // Fades in to a subtle 0.06 opacity when dark mode hits
      gridMatRef.current.opacity = THREE.MathUtils.lerp(gridMatRef.current.opacity, isDark ? 0.06 : 0, 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* The physical grid floor for this specific wall */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial ref={gridMatRef} map={gridTexture} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Videos mapped DIRECTLY onto this grid wall */}
      {videos.map((vid: any, i: number) => (
        // rotationIntensity={0} mathematically forbids them from tilting off the grid lines
        <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={0.05}>
          <VideoPlane url={vid.url} targetPos={vid.pos} targetScale={vid.scale} index={startIndex + i} />
        </Float>
      ))}
    </group>
  );
};

// --- CAMERA CONTROLLER ---
const CameraController = () => {
  const targetZ = useRef(8); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 8); 
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

// --- MASSIVE LOGO & DEEP TEXT ---
const TextCheckpoints = ({ isDark }: { isDark: boolean }) => {
  const whiteLogoRef = useRef<THREE.Mesh>(null);
  const blackLogoRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (whiteLogoRef.current && blackLogoRef.current) {
      (whiteLogoRef.current.material as THREE.Material).opacity = THREE.MathUtils.lerp((whiteLogoRef.current.material as THREE.Material).opacity, isDark ? 1 : 0, 0.2);
      (blackLogoRef.current.material as THREE.Material).opacity = THREE.MathUtils.lerp((blackLogoRef.current.material as THREE.Material).opacity, isDark ? 0 : 1, 0.2);
    }
  });

  return (
    <group>
      {/* 1. MASSIVE Center Logo (Increased to 32 scale, perfect 3.44 aspect ratio) */}
      <group position={[0, 0, -25]}>
        <Image ref={whiteLogoRef} scale={[32, 9.3]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#ffffff" />
        <Image ref={blackLogoRef} scale={[32, 9.3]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#000000" position={[0,0,0.01]} />
      </group>

      {/* 2. Hidden Text (Safe behind the fog until you scroll) */}
      <group position={[0, 0, -85]}>
        <Text fontSize={3.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">FEATURED WORK</Text>
        <Text fontSize={0.5} position={[0, -2.5, 0]} color="#aaaaaa" letterSpacing={0.5} anchorX="center" anchorY="middle">SCROLL DEEPER</Text>
      </group>

      {/* 3. Deep End Checkpoint */}
      <group position={[0, 0, -140]}>
        <Text fontSize={4.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">OUR DIRECTORS</Text>
      </group>
    </group>
  );
};

export default function TunnelScene() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Triggers the exact flashbang from your video
    const timer = setTimeout(() => setIsDark(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- MANUAL PLACEMENT (Guarantees Top and Bottom Videos appear perfectly) ---
  // Local Coordinates: [X (Depth on wall), Y (Spread across wall), Z (Must be 0.1)]
  const leftVids = [
    { url: VIDEO_FILES[0], pos: [-5, 8, 0.1], scale: [7, 3.9] },
    { url: VIDEO_FILES[1], pos: [-20, -5, 0.1], scale: [8, 4.5] },
    { url: VIDEO_FILES[2], pos: [-35, 6, 0.1], scale: [10, 5.6] },
    { url: VIDEO_FILES[3], pos: [-50, -4, 0.1], scale: [12, 6.7] }
  ];

  const rightVids = [
    { url: VIDEO_FILES[4], pos: [6, -7, 0.1], scale: [7, 3.9] },
    { url: VIDEO_FILES[5], pos: [22, 5, 0.1], scale: [8, 4.5] },
    { url: VIDEO_FILES[6], pos: [38, -6, 0.1], scale: [10, 5.6] },
    { url: VIDEO_FILES[7], pos: [52, 4, 0.1], scale: [12, 6.7] }
  ];

  const topVids = [
    { url: VIDEO_FILES[8], pos: [-8, 5, 0.1], scale: [7, 3.9] },
    { url: VIDEO_FILES[9], pos: [7, 22, 0.1], scale: [8, 4.5] },
    { url: VIDEO_FILES[10], pos: [-6, 38, 0.1], scale: [10, 5.6] },
    { url: VIDEO_FILES[11], pos: [8, 52, 0.1], scale: [12, 6.7] }
  ];

  const bottomVids = [
    { url: VIDEO_FILES[12], pos: [7, -6, 0.1], scale: [7, 3.9] },
    { url: VIDEO_FILES[13], pos: [-8, -20, 0.1], scale: [8, 4.5] },
    { url: VIDEO_FILES[14], pos: [6, -35, 0.1], scale: [10, 5.6] },
    { url: VIDEO_FILES[15], pos: [-7, -50, 0.1], scale: [12, 6.7] }
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", backgroundColor: isDark ? '#000' : '#fff' }}>
      
      <Canvas style={{ position: 'absolute', inset: 0, zIndex: 1 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <ThemeController isDark={isDark} />
          <CameraController />
          <TextCheckpoints isDark={isDark} />

          {/* 4 PHYSICAL 3D WALLS (Videos mathematically fused to the grid lines) */}
          <WallGroup position={[-16, 0, 0]} rotation={[0, 55 * (Math.PI / 180), 0]} videos={leftVids} isDark={isDark} startIndex={0} />
          <WallGroup position={[16, 0, 0]} rotation={[0, -55 * (Math.PI / 180), 0]} videos={rightVids} isDark={isDark} startIndex={4} />
          
          {/* Top and Bottom walls restored and forced into view */}
          <WallGroup position={[0, 10, 0]} rotation={[-73 * (Math.PI / 180), 0, 0]} videos={topVids} isDark={isDark} startIndex={8} />
          <WallGroup position={[0, -10, 0]} rotation={[73 * (Math.PI / 180), 0, 0]} videos={bottomVids} isDark={isDark} startIndex={12} />
          
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