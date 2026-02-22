import React, { Suspense, useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture, Image } from "@react-three/drei"; 
import * as THREE from "three";
import { useNavigate } from "react-router-dom"; 

// --- ALL 20 VIDEOS (Looped dynamically to fill the 20 slots from HTML) ---
const VIDEO_FILES = [
  "vid1.mp4", "WhatsApp Video 2026-02-21 at 3.00.26 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.27 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.28 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM (2).mp4", "WhatsApp Video 2026-02-21 at 3.00.28 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.29 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.30 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.31 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.31 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.32 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.33 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM (2).mp4", "WhatsApp Video 2026-02-21 at 3.00.33 PM.mp4", "WhatsApp Video 2026-02-21 at 3.00.34 PM (1).mp4", "WhatsApp Video 2026-02-21 at 3.00.34 PM (2).mp4"
];

const getVid = (index: number) => VIDEO_FILES[index % VIDEO_FILES.length];

// --- EXACT FRAMER PIXEL DATA EXTRACTED FROM YOUR HTML ---
const rightData = [
  { url: getVid(0), left: 6.60, top: 0.31, w: 2.42, h: 1.34 },
  { url: getVid(1), left: 6.28, top: 1.16, w: 1.65, h: 0.91 },
  { url: getVid(2), left: 3.96, top: 0.65, w: 1.24, h: 0.56 },
  { url: getVid(3), left: 7.66, bottom: 0.36, w: 1.65, h: 0.91 },
  { url: getVid(4), left: 5.14, bottom: 1.23, w: 1.65, h: 0.74 }
];

const leftData = [
  { url: getVid(5), left: 6.23, top: 1.00, w: 1.65, h: 0.81 },
  { url: getVid(6), left: 3.30, top: 0.44, w: 1.65, h: 0.91 },
  { url: getVid(7), left: 3.85, top: 1.23, w: 1.65, h: 0.91 },
  { url: getVid(8), left: 2.68, bottom: 0.36, w: 1.65, h: 0.91 },
  { url: getVid(9), left: 1.47, top: 0.85, w: 1.65, h: 0.91 }
];

const floorData = [
  { url: getVid(10), left: 0.73, bottom: 1.62, w: 1.49, h: 0.76 },
  { url: getVid(11), left: 3.42, bottom: 1.46, w: 1.15, h: 1.12 },
  { url: getVid(12), left: 0.36, bottom: 2.99, w: 1.63, h: 2.82 },
  { url: getVid(13), left: 1.42, bottom: 2.72, w: 1.16, h: 1.13 },
  { url: getVid(14), left: 3.00, bottom: 3.57, w: 1.22, h: 1.70 }
];

const skyData = [
  { url: getVid(15), left: 3.05, top: 3.98, w: 1.05, h: 1.34 },
  { url: getVid(16), left: 3.54, top: 1.78, w: 1.07, h: 0.58 },
  { url: getVid(17), left: 1.36, top: 3.29, w: 1.23, h: 0.90 },
  { url: getVid(18), left: 2.63, top: 2.22, w: 1.32, h: 0.74 },
  { url: getVid(19), left: 0.76, top: 2.08, w: 0.95, h: 0.54 }
];

// --- 2D BACKGROUND HUD ---
const BackgroundWireframe = ({ isDark }: { isDark: boolean }) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundColor: isDark ? '#000000' : '#ffffff',
    transition: 'background-color 0.1s', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
  }}>
    <svg viewBox="0 0 1516 832" preserveAspectRatio="xMidYMid slice" style={{ 
      width: '100%', height: '100%', 
      opacity: isDark ? 0.2 : 0, 
      transition: 'opacity 0.6s ease-in-out' 
    }}>
      <g stroke="#ffffff" strokeWidth="1" fill="none">
        <path d="M624.25 338.251h258.5v144.5h-258.5z M586.25 314.25h333.5v192.5h-333.5z M558.25 295.25h389.5v230.5h-389.5z M505.25 261.25h495.5v298.5h-495.5v-298.5Z M427.25 210.25h652.5v400.5h-652.5v-400.5Z M283.25 116.25h940.5v588.5h-940.5v-588.5Z M106.25 11.25h1230.5v808.5H106.25V11.25ZM723.5 482.5 543.778 830.884M723.5 338.672 543.778-9.712M674 483 337 829.496m337-491.324L337-8.324m544.499 490.823 536.111 348.497M881.499 338.673 1417.61-9.824M624.833 482.498 88.72 830.995m536.113-492.321L88.72-9.823M840 482.5l338.11 346.997M840 338.672 1178.11-8.325M793.5 483l179.722 347.884M793.5 338.171 973.222-9.712M758.249 830.999l.001-348.499m-.001-492.327.001 348.499M883 409.939h749.33m-1007.999-1H-125m1008-33.438 744.33-173m-1002.999 172-744.331-173m1003 249.5 747.83 133m-1006.498-134-747.831 133"/>
      </g>
    </svg>
  </div>
);

// --- CSS TO WEBGL COORDINATE CONVERTER ---
const CSSVideoPlane = ({ url, left, top, bottom, w, h, planeW, planeH, flyDirection, index }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  const meshRef = useRef<THREE.Mesh>(null);
  const isInit = useRef(false);

  const targetX = -planeW / 2 + left + w / 2;
  let targetY = 0;
  if (top !== undefined) targetY = planeH / 2 - top - h / 2;
  if (bottom !== undefined) targetY = -planeH / 2 + bottom + h / 2;

  const finalPos = useMemo(() => new THREE.Vector3(targetX, targetY, 0), [targetX, targetY]);
  const finalScale = useMemo(() => new THREE.Vector3(w, h, 1), [w, h]);

  const startPos = useMemo(() => new THREE.Vector3(
    targetX + flyDirection[0] * 10, 
    targetY + flyDirection[1] * 10, 
    0
  ), [targetX, targetY, flyDirection]);
  
  const startScale = useMemo(() => new THREE.Vector3(w * 0.4, h * 0.4, 1), [w, h]);

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
        // SAFELY CASTING TO AVOID TYPESCRIPT ERROR
        (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        isInit.current = true;
      }

      const delay = 0.8 + (index * 0.02); 
      if (state.clock.elapsedTime > delay) {
        meshRef.current.position.lerp(finalPos, 0.08); 
        meshRef.current.scale.lerp(finalScale, 0.08); 
        // SAFELY CASTING TO AVOID TYPESCRIPT ERROR
        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = THREE.MathUtils.lerp(material.opacity, 1, 0.1);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} /> 
      <meshBasicMaterial map={texture} toneMapped={false} transparent />
    </mesh>
  );
};

// --- FOG CONTROLLER ---
const FogController = ({ isDark }: { isDark: boolean }) => {
  const { scene } = useThree();
  const fogColor = useMemo(() => new THREE.Color("#ffffff"), []);
  
  useFrame(() => {
    const targetColor = new THREE.Color(isDark ? "#000000" : "#ffffff");
    fogColor.lerp(targetColor, 0.1);
    if (!scene.fog) scene.fog = new THREE.Fog("#ffffff", 4, 15);
    scene.fog.color.copy(fogColor);
  });
  return null;
};

// --- CAMERA CONTROLLER ---
const CameraController = () => {
  const targetZ = useRef(5);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5); 
    const handleWheel = (e: WheelEvent) => {
      targetZ.current = Math.max(-10, Math.min(5, targetZ.current - e.deltaY * 0.01));
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
const TextCheckpoints = ({ isDark }: { isDark: boolean }) => {
  const whiteLogoRef = useRef<THREE.Mesh>(null);
  const blackLogoRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (whiteLogoRef.current && blackLogoRef.current) {
      // SAFELY CASTING TO AVOID TYPESCRIPT ERROR
      const wMat = whiteLogoRef.current.material as THREE.MeshBasicMaterial;
      const bMat = blackLogoRef.current.material as THREE.MeshBasicMaterial;
      
      wMat.opacity = THREE.MathUtils.lerp(wMat.opacity, isDark ? 1 : 0, 0.2);
      bMat.opacity = THREE.MathUtils.lerp(bMat.opacity, isDark ? 0 : 1, 0.2);
    }
  });

  return (
    <group>
      <group position={[0, 0, -2]}>
        <Image ref={whiteLogoRef} scale={[6, 1.74]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#ffffff" />
        <Image ref={blackLogoRef} scale={[6, 1.74]} url="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" transparent toneMapped={false} color="#000000" position={[0,0,0.01]} />
      </group>

      <group position={[0, 0, -10]}>
        <Text fontSize={1.2} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">FEATURED WORK</Text>
      </group>

      <group position={[0, 0, -18]}>
        <Text fontSize={1.5} color="#ffffff" fontWeight={900} letterSpacing={0.1} anchorX="center" anchorY="middle">OUR DIRECTORS</Text>
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

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", backgroundColor: isDark ? '#000' : '#fff' }}>
      
      <BackgroundWireframe isDark={isDark} />

      <Canvas style={{ position: 'absolute', inset: 0, zIndex: 1 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ fov: 75 }}>
        <Suspense fallback={null}>
          <FogController isDark={isDark} />
          <CameraController />
          <TextCheckpoints isDark={isDark} />

          {/* RIGHT WALL */}
          <group rotation={[0, -55 * (Math.PI / 180), 0]}>
            {rightData.map((vid, i) => (
              <Float key={`r-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <CSSVideoPlane {...vid} planeW={11.72} planeH={3.66} flyDirection={[-1, 0]} index={i} />
              </Float>
            ))}
          </group>

          {/* LEFT WALL */}
          <group rotation={[0, 55 * (Math.PI / 180), 0]}>
            {leftData.map((vid, i) => (
              <Float key={`l-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <CSSVideoPlane {...vid} planeW={11.72} planeH={3.66} flyDirection={[1, 0]} index={i+5} />
              </Float>
            ))}
          </group>

          {/* FLOOR WALL */}
          <group rotation={[73 * (Math.PI / 180), 0, 0]}>
            {floorData.map((vid, i) => (
              <Float key={`f-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <CSSVideoPlane {...vid} planeW={5.45} planeH={10.0} flyDirection={[0, -1]} index={i+10} />
              </Float>
            ))}
          </group>

          {/* SKY WALL */}
          <group rotation={[-73 * (Math.PI / 180), 0, 0]}>
            {skyData.map((vid, i) => (
              <Float key={`s-${i}`} floatIntensity={0.05} rotationIntensity={0} speed={1.5}>
                <CSSVideoPlane {...vid} planeW={5.45} planeH={10.0} flyDirection={[0, 1]} index={i+15} />
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