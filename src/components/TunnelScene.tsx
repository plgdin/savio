import React, { Suspense, useEffect, useRef, useMemo, useState } from "react";
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

// --- FLASHBANG & FOG CONTROLLER ---
const ThemeController = () => {
  const { scene } = useThree();
  const bgColor = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame((state) => {
    const isDark = state.clock.elapsedTime > 0.8;
    const targetColor = new THREE.Color(isDark ? "#000000" : "#ffffff");
    bgColor.lerp(targetColor, 0.1);
    scene.background = bgColor;
    
    // Dense fog hides the deep text
    if (!scene.fog) scene.fog = new THREE.Fog("#ffffff", 20, 60);
    scene.fog.color.copy(bgColor);
  });
  return null;
};

// --- ANIMATED FLY-IN VIDEO PLANE ---
const VideoPlane = ({ url, targetPos, targetScale, index }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  const isInit = useRef(false);
  
  const finalPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const finalScale = useMemo(() => new THREE.Vector3(targetScale[0], targetScale[1], 1), [targetScale]);
  
  // Videos start deep behind the physical wall and punch through it
  const startPos = useMemo(() => new THREE.Vector3(0, 0, -30), []);
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

      // Explosion trigger
      const delay = 0.9 + (index * 0.03); 
      if (state.clock.elapsedTime > delay) {
        meshRef.current.position.lerp(finalPos, 0.08); 
        meshRef.current.scale.lerp(finalScale, 0.08);  
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} /> 
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

// --- 3D PERSPECTIVE FUNNEL WALL ---
const WallGroup = ({ type, position, rotation, videos }: any) => {
  // Generate a sharp, mathematically perfect wireframe grid texture
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      for (let i = 0; i <= 1024; i += 64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke(); // Verticals
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke(); // Horizontals
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 40); // Stretches grid deep into the tunnel
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, []);

  const gridMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const isDark = state.clock.elapsedTime > 0.8;
    if (gridMatRef.current) {
      gridMatRef.current.opacity = THREE.MathUtils.lerp(gridMatRef.current.opacity, isDark ? 1 : 0, 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* The physical grid wall */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial ref={gridMatRef} map={gridTexture} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Videos mapped DIRECTLY onto the grid wall (Z=0.1 to sit just on top of lines) */}
      {videos.map((vid: any, i: number) => (
        <Float key={i} speed={0.8} rotationIntensity={0.01} floatIntensity={0.05}>
          <VideoPlane url={vid.url} targetPos={[vid.x, vid.y, 0.1]} targetScale={vid.scale} index={vid.globalIndex} />
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

// --- LOGO & DEEP TEXT ---
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
      <group position={[0, 0, -20]}>
        <Image ref={whiteLogoRef} scale={[22, 6.4]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#ffffff" />
        <Image ref={blackLogoRef} scale={[22, 6.4]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#000000" position={[0,0,0.01]} />
      </group>

      <group position={[0, 0, -60]}>
        <Text fontSize={3} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">FEATURED WORK</Text>
        <Text fontSize={0.4} position={[0, -2, 0]} color="#aaaaaa" letterSpacing={0.5} anchorX="center" anchorY="middle">SCROLL DEEPER</Text>
      </group>

      <group position={[0, 0, -100]}>
        <Text fontSize={3.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">OUR DIRECTORS</Text>
      </group>
    </group>
  );
};

export default function TunnelScene() {
  const navigate = useNavigate();

  // Distribute the 18 videos perfectly across the 4 physical walls
  const wallData = useMemo(() => {
    const w = { left: [] as any[], right: [] as any[], top: [] as any[], bottom: [] as any[] };
    
    VIDEO_FILES.forEach((url, i) => {
      const side = i % 4;
      const depthStep = Math.floor(i / 4);
      
      const width = 4.5 + (i % 3) * 0.8;
      const height = width * 0.5625;
      const scale = [width, height];
      
      // Calculate depth and scatter based on which wall it is
      // Math ensures they stagger backward evenly down the wall
      const depthDist = 10 + (depthStep * 16); 
      const scatter = (i % 3) * 6 - 6; 

      if (side === 0) w.left.push({ url, x: -depthDist, y: scatter, scale, globalIndex: i });
      else if (side === 1) w.right.push({ url, x: depthDist, y: scatter, scale, globalIndex: i });
      else if (side === 2) w.top.push({ url, x: scatter, y: -depthDist, scale, globalIndex: i });
      else w.bottom.push({ url, x: scatter, y: depthDist, scale, globalIndex: i });
    });
    return w;
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <Canvas gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <ThemeController />
          <CameraController />
          <TextCheckpoints />

          {/* THE 4 PHYSICAL TUNNEL WALLS (Exact Framer Angles) */}
          <WallGroup type="left" position={[-11, 0, 0]} rotation={[0, 0.959, 0]} videos={wallData.left} />
          <WallGroup type="right" position={[11, 0, 0]} rotation={[0, -0.959, 0]} videos={wallData.right} />
          <WallGroup type="top" position={[0, 7, 0]} rotation={[1.274, 0, 0]} videos={wallData.top} />
          <WallGroup type="bottom" position={[0, -7, 0]} rotation={[-1.274, 0, 0]} videos={wallData.bottom} />
          
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