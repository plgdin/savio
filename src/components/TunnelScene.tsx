import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

const FOV = 65; 

/* ---------------- THE GRID TUNNEL LAYOUT ---------------- */
// Positioned strictly along the 4 walls of the perspective box
const PANELS = [
  // --- LEFT WALL (Rotation: Y = PI/2) ---
  { pos: [-5, 1.5, -3],    rot: [0, Math.PI / 2.5, 0],  scale: [4, 2.2] },
  { pos: [-5, -2, -10],    rot: [0, Math.PI / 2.2, 0],  scale: [4.5, 2.5] },
  { pos: [-5, 2.5, -18],   rot: [0, Math.PI / 2.1, 0],  scale: [5, 2.8] },

  // --- RIGHT WALL (Rotation: Y = -PI/2) ---
  { pos: [5, -1.8, -4],    rot: [0, -Math.PI / 2.5, 0], scale: [4, 2.2] },
  { pos: [5, 2.2, -11],    rot: [0, -Math.PI / 2.2, 0], scale: [4.5, 2.5] },
  { pos: [5, -2.5, -20],   rot: [0, -Math.PI / 2.1, 0], scale: [5.5, 3] },

  // --- CEILING (Rotation: X = PI/2) ---
  { pos: [-2, 4.5, -6],    rot: [Math.PI / 2.2, 0, 0],  scale: [3.5, 2] },
  { pos: [2.5, 4.5, -14],  rot: [Math.PI / 2.1, 0, 0],  scale: [4.5, 2.5] },

  // --- FLOOR (Rotation: X = -PI/2) ---
  { pos: [2, -4.5, -7],    rot: [-Math.PI / 2.2, 0, 0], scale: [3.5, 2] },
  { pos: [-2.5, -4.5, -16], rot: [-Math.PI / 2.1, 0, 0], scale: [4.5, 2.5] },
  
  // --- DEEP CENTER (Vanishing point fill) ---
  { pos: [0, 0, -25],      rot: [0, 0, 0],              scale: [6, 3.5] }
];

const CameraController = () => {
  const targetZ = useRef(4); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, -10);
    const handleWheel = (e: WheelEvent) => {
      const scrollDirection = e.deltaY > 0 ? -1 : 1; 
      targetZ.current = Math.max(-22, Math.min(4, targetZ.current + scrollDirection * 2));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

const VideoPlane = ({ data }: any) => {
  const texture = useVideoTexture("/vid1.mp4", { crossOrigin: "Anonymous" });
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
};

const MediaPanel = ({ data }: any) => {
  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
      <VideoPlane data={data} />
    </Float>
  );
};

const CentralLogo = () => (
  <group position={[0, 0, -3]}>
    <Text
      fontSize={1.2} 
      scale={[1.6, 1, 1]} 
      font="https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvC73w0aXpsog.woff"
      letterSpacing={-0.05}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text
      fontSize={0.2}
      position={[0, -0.9, 0]}
      letterSpacing={0.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      FILMS
    </Text>
  </group>
);

export default function TunnelScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      
      <video
        autoPlay loop muted playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2, zIndex: 0 }}
      >
        <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
      </video>

      {/* The grid lines from the screenshot */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(circle, black, transparent 80%)'
        }} 
      />

      <Canvas gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <Suspense fallback={null}>
          <CameraController />
          <fog attach="fog" args={["#000000", 8, 30]} />
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