import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";

const FOV = 65; 

/* ---------------- CONTROLLED CHAOS LAYOUT ---------------- */
const PANELS = [
  { pos: [-4.5, 1.2, -1],    rot: [0.1, Math.PI / 5, 0.05],   scale: [2.5, 1.5] },
  { pos: [5.2, -1.5, -1.5],  rot: [-0.1, -Math.PI / 6, 0],    scale: [2.8, 1.7] },
  { pos: [-7.5, -2, -5],     rot: [0, Math.PI / 4, 0.1],      scale: [3.2, 1.9] },
  { pos: [6.5, 2.8, -4.5],   rot: [0, -Math.PI / 5, -0.1],    scale: [3, 1.8] },
  { pos: [-8, 3.5, -10],     rot: [0.2, Math.PI / 5, 0],      scale: [3.8, 2.2] },
  { pos: [8.5, -2.5, -9],    rot: [-0.1, -Math.PI / 4, 0],    scale: [3.5, 2] },
  { pos: [-1.5, 5, -3.5],    rot: [Math.PI / 4, 0.1, 0.05],   scale: [2.8, 1.6] },
  { pos: [2.5, 6.5, -8],     rot: [Math.PI / 5, -0.1, 0],     scale: [3.5, 2] },
  { pos: [2, -5.5, -4],      rot: [-Math.PI / 4, -0.1, 0],    scale: [3, 1.8] },
  { pos: [-3.5, -6, -9],     rot: [-Math.PI / 5, 0.2, 0.05],  scale: [3.8, 2.2] },
  { pos: [-3, -1.5, -18],    rot: [0.05, 0.2, 0],             scale: [5, 3] },
  { pos: [4, 2, -20],        rot: [-0.05, -0.15, 0],          scale: [6, 3.5] }
];

/* ---------------- CINEMATIC CAMERA CONTROLLER ---------------- */
const CameraController = () => {
  const scroll = useScroll();

  useFrame((state) => {
    // This is your Framer snap-back animation.
    // The camera starts at Z=-1 (in the Canvas props). 
    // This lerp immediately pulls it back to Z=5, creating a rapid zoom-out reveal.
    const targetZ = 5 - scroll.offset * 20; 
    state.camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.06); 
  });

  return null;
};

/* ---------------- COMPONENTS ---------------- */

// THE FIX: Pure 3D geometry. Zero external network requests.
const BasicPanel = ({ data }: any) => {
  return (
    <Float speed={2} rotationIntensity={0.08} floatIntensity={0.15}>
      <mesh position={data.pos as [number, number, number]} rotation={data.rot as [number, number, number]}>
        <planeGeometry args={[data.scale[0], data.scale[1]]} />
        {/* Simple dark grey placeholder material */}
        <meshBasicMaterial color="#333333" />
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
      
      {/* 2D GRID OVERLAY */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />

      {/* SPAWN CAMERA AT Z=-1 for the intro snap-back reveal */}
      <Canvas camera={{ position: [0, 0, -1], fov: FOV }} gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.25}>
            <CameraController />
            <fog attach="fog" args={["#000000", 2, 28]} />
            <ambientLight intensity={1} />
            
            <CentralLogo />
            
            {PANELS.map((panel, i) => (
              <BasicPanel key={i} data={panel} />
            ))}
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}