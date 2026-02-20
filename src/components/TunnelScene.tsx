import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

const FOV = 65; 

/* ---------------- THE BREATHING COLLAGE LAYOUT ---------------- */
const PANELS = [
  { pos: [-5, 1.5, -1],   rot: [0, Math.PI / 5, 0],  scale: [2.5, 1.5], color: "#ff4444" },
  { pos: [5, -1.5, -1],   rot: [0, -Math.PI / 5, 0], scale: [2.5, 1.5], color: "#4444ff" },
  { pos: [-7, -2.5, -5],  rot: [0, Math.PI / 5, 0],  scale: [3, 1.8],   color: "#44ff44" },
  { pos: [-8, 3, -9],     rot: [0, Math.PI / 5, 0],  scale: [3.5, 2],   color: "#ffff44" },
  { pos: [-9, -1, -14],   rot: [0, Math.PI / 6, 0],  scale: [4, 2.5],   color: "#ff44ff" },
  { pos: [7, 2.5, -5],    rot: [0, -Math.PI / 5, 0], scale: [3, 1.8],   color: "#44ffff" },
  { pos: [8, -3, -9],     rot: [0, -Math.PI / 5, 0], scale: [3.5, 2],   color: "#ff8844" },
  { pos: [9, 1, -14],     rot: [0, -Math.PI / 6, 0], scale: [4, 2.5],   color: "#8844ff" },
  { pos: [-2.5, 4.5, -3], rot: [Math.PI / 5, 0, 0],  scale: [2.8, 1.6], color: "#44ff88" },
  { pos: [3, 6, -8],      rot: [Math.PI / 5, 0, 0],  scale: [3.5, 2],   color: "#ff4444" },
  { pos: [2.5, -4.5, -3], rot: [-Math.PI / 5, 0, 0], scale: [2.8, 1.6], color: "#4444ff" },
  { pos: [-3, -6, -8],    rot: [-Math.PI / 5, 0, 0], scale: [3.5, 2],   color: "#44ff44" },
  { pos: [-2, -1, -20],   rot: [0, 0.1, 0],          scale: [5, 3],     color: "#555555" },
  { pos: [3, 2, -22],     rot: [0, -0.1, 0],         scale: [5.5, 3.2], color: "#777777" }
];

/* ---------------- CUSTOM BULLETPROOF CAMERA CONTROLLER ---------------- */
const CameraController = () => {
  const targetZ = useRef(4); 
  // We extract the raw Three.js camera object directly from the Fiber context
  const { camera } = useThree();

  useEffect(() => {
    // FORCE the camera deep into the tunnel immediately on mount. 
    // It will spawn behind the text and violently pull backward.
    camera.position.set(0, 0, -10);

    const handleWheel = (e: WheelEvent) => {
      // Scroll down pushes you deeper into the tunnel
      const scrollDirection = e.deltaY > 0 ? -1 : 1; 
      targetZ.current = Math.max(-15, Math.min(4, targetZ.current + scrollDirection * 1.5));
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    // Smoothly lerps the camera from its forced -10 start position to the targetZ (4)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });

  return null;
};

/* ---------------- COMPONENTS ---------------- */
const SafePanel = ({ data }: any) => {
  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
      <mesh position={data.pos} rotation={data.rot}>
        <planeGeometry args={data.scale} />
        <meshBasicMaterial color={data.color} wireframe={true} />
        <meshBasicMaterial color="#111111" />
      </mesh>
    </Float>
  );
};

/* ---------------- CENTRAL LOGO ---------------- */
const CentralLogo = () => (
  <group position={[0, 0, -3]}>
    <Text
      fontSize={1.1} 
      scale={[1.7, 1, 1]} 
      letterSpacing={-0.08}
      color="#ffffff"
      strokeWidth={0.04} 
      strokeColor="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text
      fontSize={0.18}
      position={[0, -0.85, 0]}
      letterSpacing={2}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      FILMS
    </Text>
  </group>
);

/* ---------------- MAIN APP ---------------- */
export default function TunnelScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      
      <video
        autoPlay loop muted playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, zIndex: 0, pointerEvents: "none" }}
      >
        <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
      </video>

      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />

      <Canvas gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <Suspense fallback={null}>
          <CameraController />
          
          <fog attach="fog" args={["#000000", 2, 22]} />
          <ambientLight intensity={1} />

          <CentralLogo />

          {PANELS.map((panel, i) => (
            <SafePanel key={i} data={panel} index={i} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}