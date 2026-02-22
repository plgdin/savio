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

// --- THE EXACT SVG WIREFRAME FROM FRAMER ---
const BackgroundWireframe = ({ isDark }: { isDark: boolean }) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundColor: isDark ? '#000000' : '#ffffff',
    transition: 'background-color 0.1s', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
  }}>
    <svg 
      viewBox="0 0 1516 832" 
      preserveAspectRatio="xMidYMid slice" 
      style={{ 
        width: '100%', height: '100%', 
        opacity: isDark ? 0.04 : 0, // Dropped to 0.04 for that subtle, high-end HUD look
        transition: 'opacity 0.6s ease-in-out' 
      }}
    >
      <g stroke="#ffffff" strokeWidth="1" fill="none">
        <path d="M624.25 338.251h258.5v144.5h-258.5z"/>
        <path d="M586.25 314.25h333.5v192.5h-333.5z"/>
        <path d="M558.25 295.25h389.5v230.5h-389.5z"/>
        <path d="M505.25 261.25h495.5v298.5h-495.5v-298.5Z"/>
        <path d="M427.25 210.25h652.5v400.5h-652.5v-400.5Z"/>
        <path d="M283.25 116.25h940.5v588.5h-940.5v-588.5Z"/>
        <path d="M106.25 11.25h1230.5v808.5H106.25V11.25ZM723.5 482.5 543.778 830.884M723.5 338.672 543.778-9.712M674 483 337 829.496m337-491.324L337-8.324m544.499 490.823 536.111 348.497M881.499 338.673 1417.61-9.824M624.833 482.498 88.72 830.995m536.113-492.321L88.72-9.823M840 482.5l338.11 346.997M840 338.672 1178.11-8.325M793.5 483l179.722 347.884M793.5 338.171 973.222-9.712M758.249 830.999l.001-348.499m-.001-492.327.001 348.499M883 409.939h749.33m-1007.999-1H-125m1008-33.438 744.33-173m-1002.999 172-744.331-173m1003 249.5 747.83 133m-1006.498-134-747.831 133"/>
      </g>
    </svg>
  </div>
);

// --- DYNAMIC FOG CONTROLLER ---
const FogController = ({ isDark }: { isDark: boolean }) => {
  const { scene } = useThree();
  const fogColor = useMemo(() => new THREE.Color("#ffffff"), []);
  
  useFrame(() => {
    const targetColor = new THREE.Color(isDark ? "#000000" : "#ffffff");
    fogColor.lerp(targetColor, 0.1);
    if (!scene.fog) scene.fog = new THREE.Fog("#ffffff", 25, 75);
    scene.fog.color.copy(fogColor);
  });
  return null;
};

// --- ANIMATED VIDEO PLANE ---
const VideoPlane = ({ url, targetPos, targetScale, index }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  const isInit = useRef(false);
  
  const finalPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const finalScale = useMemo(() => new THREE.Vector3(targetScale[0], targetScale[1], 1), [targetScale]);
  
  // Start flat at 0 scale to create the explosion effect
  const startPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
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

      // Explodes outward right after the flashbang
      const delay = 0.9 + (index * 0.03); 
      if (state.clock.elapsedTime > delay) {
        meshRef.current.position.lerp(finalPos, 0.08); 
        meshRef.current.scale.lerp(finalScale, 0.08);  
      }
    }
  });

  return (
    // Z is locked to 0 on the plane geometry so it stays flush with the parent group angle
    <mesh ref={meshRef} position={[0, 0, 0]}>
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
      <group position={[0, 0, -20]}>
        <Image ref={whiteLogoRef} scale={[24, 7]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#ffffff" />
        <Image ref={blackLogoRef} scale={[24, 7]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#000000" position={[0,0,0.01]} />
      </group>

      <group position={[0, 0, -85]}>
        <Text fontSize={3} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">FEATURED WORK</Text>
        <Text fontSize={0.4} position={[0, -2, 0]} color="#aaaaaa" letterSpacing={0.5} anchorX="center" anchorY="middle">SCROLL DEEPER</Text>
      </group>

      <group position={[0, 0, -140]}>
        <Text fontSize={3.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">OUR DIRECTORS</Text>
      </group>
    </group>
  );
};

export default function TunnelScene() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsDark(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- THE MASTER ALGORITHM: STRICTLY CATEGORIZING INTO 4 FLAT PLANES ---
  const wallGroups = useMemo(() => {
    const groups = { left: [] as any[], right: [] as any[], top: [] as any[], bottom: [] as any[] };
    
    VIDEO_FILES.forEach((url, i) => {
      const side = i % 4;
      const step = Math.floor(i / 4);

      // Math to push videos deep into the tunnel and scatter them flat on the walls
      const depth = 5 + step * 10; 
      const spread = (i % 3) * 5 - 5; 

      const w = 4.5 + (i % 3) * 0.8; 
      const h = w * 0.5625; 
      const scale = [w, h];

      // Note: Videos only move on local X and Y. Z is locked so they NEVER leave the wall surface.
      if (side === 0) groups.left.push({ url, localPos: [-depth, spread, 0], scale, globalIndex: i });
      else if (side === 1) groups.right.push({ url, localPos: [depth, spread, 0], scale, globalIndex: i });
      else if (side === 2) groups.top.push({ url, localPos: [spread, depth, 0], scale, globalIndex: i });
      else groups.bottom.push({ url, localPos: [spread, -depth, 0], scale, globalIndex: i });
    });
    return groups;
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      
      <BackgroundWireframe isDark={isDark} />

      <Canvas style={{ position: 'absolute', inset: 0, zIndex: 1 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <FogController isDark={isDark} />
          <CameraController />
          <TextCheckpoints />

          {/* LEFT WALL (Rotated exactly 55deg) */}
          <group position={[-12, 0, 0]} rotation={[0, 55 * (Math.PI / 180), 0]}>
            {wallGroups.left.map((vid, i) => (
              <Float key={`left-${i}`} floatIntensity={0.05} rotationIntensity={0}>
                <VideoPlane url={vid.url} targetPos={vid.localPos} targetScale={vid.scale} index={vid.globalIndex} />
              </Float>
            ))}
          </group>

          {/* RIGHT WALL (Rotated exactly -55deg) */}
          <group position={[12, 0, 0]} rotation={[0, -55 * (Math.PI / 180), 0]}>
            {wallGroups.right.map((vid, i) => (
              <Float key={`right-${i}`} floatIntensity={0.05} rotationIntensity={0}>
                <VideoPlane url={vid.url} targetPos={vid.localPos} targetScale={vid.scale} index={vid.globalIndex} />
              </Float>
            ))}
          </group>

          {/* SKY / TOP WALL (Rotated exactly -73deg) */}
          <group position={[0, 8, 0]} rotation={[-73 * (Math.PI / 180), 0, 0]}>
            {wallGroups.top.map((vid, i) => (
              <Float key={`top-${i}`} floatIntensity={0.05} rotationIntensity={0}>
                <VideoPlane url={vid.url} targetPos={vid.localPos} targetScale={vid.scale} index={vid.globalIndex} />
              </Float>
            ))}
          </group>

          {/* FLOOR / BOTTOM WALL (Rotated exactly 73deg) */}
          <group position={[0, -8, 0]} rotation={[73 * (Math.PI / 180), 0, 0]}>
            {wallGroups.bottom.map((vid, i) => (
              <Float key={`bottom-${i}`} floatIntensity={0.05} rotationIntensity={0}>
                <VideoPlane url={vid.url} targetPos={vid.localPos} targetScale={vid.scale} index={vid.globalIndex} />
              </Float>
            ))}
          </group>
          
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