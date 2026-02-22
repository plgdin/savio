import React, { Suspense, useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture, Image } from "@react-three/drei"; 
import * as THREE from "three";
import { useNavigate } from "react-router-dom"; 

// --- DYNAMIC CONFIG: 16 VIDEOS (4 Per Wall to match Framer) ---
const VIDEO_FILES = [
  "vid1.mp4", "WhatsApp Video 2026-02-21 at 3.00.26 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.27 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.28 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM (2).mp4", "WhatsApp Video 2026-02-21 at 3.00.28 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.29 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.30 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.31 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.31 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.32 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.33 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM (2).mp4", "WhatsApp Video 2026-02-21 at 3.00.33 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.34 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.34 PM (2).mp4"
];

// --- THE EXACT SVG WIREFRAME HUD ---
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
        opacity: isDark ? 0.08 : 0, 
        transition: 'opacity 0.6s ease-in-out' 
      }}
    >
      <g stroke="#ffffff" strokeWidth="1.5" fill="none">
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

// --- ANIMATED FLY-OUT VIDEO PLANE ---
// Needs to start at [0,0,0] inside its parent wall, then scale up.
const VideoPlane = ({ url, targetPos, targetScale, index }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  const isInit = useRef(false);
  
  const finalPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const finalScale = useMemo(() => new THREE.Vector3(targetScale[0], targetScale[1], 1), [targetScale]);
  
  // Starting state for explosion
  const startPos = useMemo(() => new THREE.Vector3(0, 0, -10), []);
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
      const delay = 0.9 + (index * 0.04); 
      if (state.clock.elapsedTime > delay) {
        meshRef.current.position.lerp(finalPos, 0.08); 
        meshRef.current.scale.lerp(finalScale, 0.08);  
      }
    }
  });

  return (
    // Z is 0 so it lays flush on the parent wall
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

  // --- HARDCODED "FRAMER" WALL LAYOUTS ---
  // These arrays act exactly like the 4 <div> folders in the Framer HTML.
  // [X position on wall, Y position on wall, Z depth on wall]
  const leftWallVids = [
    { url: VIDEO_FILES[0], pos: [2, 6, -10], scale: [7, 3.9] },
    { url: VIDEO_FILES[1], pos: [-2, -5, -25], scale: [6, 3.3] },
    { url: VIDEO_FILES[2], pos: [4, 2, -40], scale: [8, 4.5] },
    { url: VIDEO_FILES[3], pos: [-3, -2, -55], scale: [5.5, 3.1] }
  ];

  const rightWallVids = [
    { url: VIDEO_FILES[4], pos: [-2, 5, -12], scale: [6.5, 3.6] },
    { url: VIDEO_FILES[5], pos: [3, -4, -28], scale: [5.5, 3.1] },
    { url: VIDEO_FILES[6], pos: [-4, 3, -45], scale: [7.5, 4.2] },
    { url: VIDEO_FILES[7], pos: [2, -6, -60], scale: [6, 3.3] }
  ];

  const topWallVids = [
    { url: VIDEO_FILES[8], pos: [-5, 2, -15], scale: [7, 3.9] },
    { url: VIDEO_FILES[9], pos: [6, -1, -30], scale: [6, 3.3] },
    { url: VIDEO_FILES[10], pos: [-3, 4, -48], scale: [8, 4.5] },
    { url: VIDEO_FILES[11], pos: [4, -3, -65], scale: [5.5, 3.1] }
  ];

  const bottomWallVids = [
    { url: VIDEO_FILES[12], pos: [5, 1, -18], scale: [6.5, 3.6] },
    { url: VIDEO_FILES[13], pos: [-6, -2, -35], scale: [5.5, 3.1] },
    { url: VIDEO_FILES[14], pos: [3, 5, -50], scale: [7.5, 4.2] },
    { url: VIDEO_FILES[15], pos: [-4, -4, -70], scale: [6, 3.3] }
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      
      {/* 2D HUD Wireframe */}
      <BackgroundWireframe isDark={isDark} />

      <Canvas style={{ position: 'absolute', inset: 0, zIndex: 1 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ fov: 85 }}>
        <Suspense fallback={null}>
          <FogController isDark={isDark} />
          <CameraController />
          <TextCheckpoints />

          {/* EXACT FRAMER FOLDERS: 4 Walls rotated to 55deg and 73deg */}
          {/* LEFT WALL */}
          <group position={[-12, 0, 0]} rotation={[0, 55 * (Math.PI / 180), 0]}>
            {leftWallVids.map((vid, i) => (
              <Float key={`l-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <VideoPlane url={vid.url} targetPos={vid.pos} targetScale={vid.scale} index={i} />
              </Float>
            ))}
          </group>

          {/* RIGHT WALL */}
          <group position={[12, 0, 0]} rotation={[0, -55 * (Math.PI / 180), 0]}>
            {rightWallVids.map((vid, i) => (
              <Float key={`r-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <VideoPlane url={vid.url} targetPos={vid.pos} targetScale={vid.scale} index={i+4} />
              </Float>
            ))}
          </group>

          {/* TOP / SKY WALL */}
          <group position={[0, 8, 0]} rotation={[73 * (Math.PI / 180), 0, 0]}>
            {topWallVids.map((vid, i) => (
              <Float key={`t-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <VideoPlane url={vid.url} targetPos={vid.pos} targetScale={vid.scale} index={i+8} />
              </Float>
            ))}
          </group>

          {/* BOTTOM / FLOOR WALL */}
          <group position={[0, -8, 0]} rotation={[-73 * (Math.PI / 180), 0, 0]}>
            {bottomWallVids.map((vid, i) => (
              <Float key={`b-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <VideoPlane url={vid.url} targetPos={vid.pos} targetScale={vid.scale} index={i+12} />
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