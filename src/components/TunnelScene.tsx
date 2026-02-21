import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

const FOV = 65; 

/* ---------------- THE CINEMATIC TUNNEL LAYOUT ---------------- */
// Angles increased to match the "leaning" effect in the Framer screenshot.
const PANELS = [
  // LEFT WALL (Aggressive Y rotation)
  { pos: [-4.2, 1.5, -2],    rot: [0.1, 0.8, 0.1],    scale: [3, 1.8] },
  { pos: [-5.5, -1.8, -6],   rot: [-0.05, 1.1, 0],    scale: [3.5, 2.1] },
  { pos: [-6.5, 0.5, -12],   rot: [0, 1.3, -0.1],     scale: [4, 2.4] },
  { pos: [-7.5, 3.2, -18],   rot: [0.2, 1.4, 0],      scale: [5, 3] },

  // RIGHT WALL (Mirroring the lean)
  { pos: [4.2, -1.2, -2.5],  rot: [-0.1, -0.8, -0.05], scale: [3, 1.8] },
  { pos: [5.5, 2.2, -7],     rot: [0.05, -1.1, 0.1],   scale: [3.5, 2.1] },
  { pos: [6.5, -2.5, -13],   rot: [0, -1.3, 0],        scale: [4.5, 2.7] },
  { pos: [7.5, 1.8, -19],    rot: [-0.1, -1.4, -0.05], scale: [5.5, 3.3] },

  // TOP & BOTTOM (Framing the perspective)
  { pos: [0, 4.8, -4],       rot: [1.2, 0, 0],         scale: [3.2, 2] },
  { pos: [-2, -4.5, -9],     rot: [-1.1, 0.2, 0.1],    scale: [3.8, 2.3] },
  { pos: [2.5, -5.5, -15],   rot: [-1.3, -0.1, 0],     scale: [4.5, 2.7] },
  { pos: [0, 6, -22],        rot: [1.4, 0, 0],         scale: [6, 3.5] }
];

/* ---------------- CAMERA CONTROLLER ---------------- */
const CameraController = () => {
  const targetZ = useRef(4); 
  const { camera } = useThree();

  useEffect(() => {
    // Starting deep inside for the snap-back reveal
    camera.position.set(0, 0, -10);

    const handleWheel = (e: WheelEvent) => {
      const scrollDirection = e.deltaY > 0 ? -1 : 1; 
      targetZ.current = Math.max(-18, Math.min(4, targetZ.current + scrollDirection * 1.8));
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });

  return null;
};

/* ---------------- COMPONENTS ---------------- */
const VideoPlane = ({ data }: any) => {
  // Texture from your public folder
  const texture = useVideoTexture("/vid1.mp4", { crossOrigin: "Anonymous" });
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      {/* Set color to white for full video brightness */}
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const MediaPanel = ({ data }: any) => {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <VideoPlane data={data} />
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
      
      {/* MAIN BACKGROUND VIDEO */}
      <video
        autoPlay loop muted playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, zIndex: 0, pointerEvents: "none" }}
      >
        <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY GRID */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} 
      />

      <Canvas gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <Suspense fallback={null}>
          <CameraController />
          <fog attach="fog" args={["#000000", 5, 25]} />
          <ambientLight intensity={1.5} />
          
          <CentralLogo />

          {PANELS.map((panel, i) => (
            <MediaPanel key={i} data={panel} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}