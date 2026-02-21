import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

// --- 3D GRID WALLS ---
// This creates the "Room" look by placing grid textures on the 4 sides
const TunnelBox = () => {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 10); // Stretches the grid deep into the tunnel
    return tex;
  }, []);

  return (
    <group>
      {/* Left Wall */}
      <mesh position={[-6, 0, -10]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 12]} />
        <meshBasicMaterial map={gridTexture} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[6, 0, -10]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[40, 12]} />
        <meshBasicMaterial map={gridTexture} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, -5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 40]} />
        <meshBasicMaterial map={gridTexture} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 5, -10]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 40]} />
        <meshBasicMaterial map={gridTexture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const PANELS = [
  // LEFT WALL
  { pos: [-5.9, 1.5, -2],    rot: [0, Math.PI / 2, 0],  scale: [4, 2.2] },
  { pos: [-5.9, -1.8, -12],  rot: [0, Math.PI / 2, 0],  scale: [5, 2.8] },
  // RIGHT WALL
  { pos: [5.9, -1.2, -5],   rot: [0, -Math.PI / 2, 0], scale: [4, 2.2] },
  { pos: [5.9, 2, -18],     rot: [0, -Math.PI / 2, 0], scale: [6, 3.5] },
  // FLOOR
  { pos: [-2, -4.9, -8],    rot: [-Math.PI / 2, 0, 0], scale: [4, 2.5] },
  { pos: [2, -4.9, -15],    rot: [-Math.PI / 2, 0, 0], scale: [5, 3] },
  // CEILING
  { pos: [1.5, 4.9, -10],   rot: [Math.PI / 2, 0, 0],  scale: [4, 2.5] }
];

const CameraController = () => {
  const targetZ = useRef(4); 
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, -10);
    const handleWheel = (e: WheelEvent) => {
      targetZ.current = Math.max(-25, Math.min(4, targetZ.current - e.deltaY * 0.01));
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.05);
  });
  return null;
};

const VideoPlane = ({ data }: any) => {
  const texture = useVideoTexture("/vid1.mp4");
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const CentralLogo = () => (
  <group position={[0, 0, -3]}>
    <Text fontSize={1.2} scale={[1.6, 1, 1]} color="#ffffff" anchorX="center" anchorY="middle">
      PANORAMA
    </Text>
    <Text fontSize={0.2} position={[0, -0.9, 0]} color="#ffffff" anchorX="center" anchorY="middle">
      FILMS
    </Text>
  </group>
);

export default function TunnelScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas gl={{ antialias: true }} camera={{ fov: 60 }}>
        <Suspense fallback={null}>
          <CameraController />
          <TunnelBox />
          <CentralLogo />
          {PANELS.map((panel, i) => (
            <Float key={i} speed={1} rotationIntensity={0.05} floatIntensity={0.05}>
              <VideoPlane data={panel} />
            </Float>
          ))}
          <fog attach="fog" args={["#000", 5, 35]} />
        </Suspense>
      </Canvas>
      
      {/* Menu Button UI Overlay */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button style={{ 
          padding: '10px 30px', borderRadius: '20px', border: 'none', 
          backgroundColor: 'white', color: 'black', fontWeight: 'bold', 
          cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px' 
        }}>
          Menu
        </button>
      </div>
    </div>
  );
}

import { useMemo } from "react"; // Add this to your imports at the top