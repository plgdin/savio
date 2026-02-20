import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

const FOV = 65; 

/* ---------------- THE CONTROLLED CHAOS LAYOUT ---------------- */
// Every single panel is now a video using vid1.mp4.
// No images = No 404 errors for missing JPEGs.
const PANELS = [
  { pos: [-4.5, 1.2, -1], rot: [0.1, Math.PI / 5, 0.05], scale: [2.5, 1.5] },
  { pos: [5.2, -1.5, -1.5], rot: [-0.1, -Math.PI / 6, 0], scale: [2.8, 1.7] },
  { pos: [-7.5, -2, -5], rot: [0, Math.PI / 4, 0.1], scale: [3.2, 1.9] },
  { pos: [6.5, 2.8, -4.5], rot: [0, -Math.PI / 5, -0.1], scale: [3, 1.8] },
  { pos: [-8, 3.5, -10], rot: [0.2, Math.PI / 5, 0], scale: [3.8, 2.2] },
  { pos: [8.5, -2.5, -9], rot: [-0.1, -Math.PI / 4, 0], scale: [3.5, 2] },
  { pos: [-1.5, 5, -3.5], rot: [Math.PI / 4, 0.1, 0.05], scale: [2.8, 1.6] },
  { pos: [2.5, 6.5, -8], rot: [Math.PI / 5, -0.1, 0], scale: [3.5, 2] },
  { pos: [2, -5.5, -4], rot: [-Math.PI / 4, -0.1, 0], scale: [3, 1.8] },
  { pos: [-3.5, -6, -9], rot: [-Math.PI / 5, 0.2, 0.05], scale: [3.8, 2.2] },
  { pos: [-3, -1.5, -18], rot: [0.05, 0.2, 0], scale: [5, 3] },
  { pos: [4, 2, -20], rot: [-0.05, -0.15, 0], scale: [6, 3.5] }
];

/* ---------------- CAMERA CONTROLLER ---------------- */
const CameraController = () => {
  const targetZ = useRef(4); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, -10);

    const handleWheel = (e: WheelEvent) => {
      const scrollDirection = e.deltaY > 0 ? -1 : 1; 
      targetZ.current = Math.max(-15, Math.min(4, targetZ.current + scrollDirection * 1.5));
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
  // Pulls vid1.mp4 for every single panel
  const texture = useVideoTexture("/vid1.mp4", { crossOrigin: "Anonymous" });
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      <meshBasicMaterial map={texture} toneMapped={false} color="#aaaaaa" />
    </mesh>
  );
};

const MediaPanel = ({ data }: any) => {
  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
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
            <MediaPanel key={i} data={panel} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}