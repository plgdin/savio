import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const FOV_WARP = 75; 

// Mapped exactly to the 12 specific image floating points
const EXACT_FRAMER_LAYOUT = [
  // LEFT WALL
  { pos: [-12, -1, -12],  rot: [0, Math.PI / 3, 0], scale: [8, 5] },   
  { pos: [-18, 3, -25],   rot: [0, Math.PI / 4, 0], scale: [10, 6] },  
  { pos: [-10, -5, -6],   rot: [0, Math.PI / 2.5, 0], scale: [9, 5] }, 

  // RIGHT WALL
  { pos: [12, 4, -8],     rot: [0, -Math.PI / 3, 0], scale: [10, 6] },  
  { pos: [16, -1, -22],   rot: [0, -Math.PI / 4, 0], scale: [9, 5] },   
  { pos: [10, -4, -5],    rot: [0, -Math.PI / 2.5, 0], scale: [8, 5] }, 

  // TOP WALL
  { pos: [-5, 7, -10],    rot: [Math.PI / 3, 0, 0], scale: [7, 4] },    
  { pos: [4, 8, -15],     rot: [Math.PI / 4, 0, 0], scale: [8, 4.5] },  
  { pos: [0, 5, -28],     rot: [Math.PI / 6, 0, 0], scale: [6, 3.5] },  

  // BOTTOM WALL
  { pos: [-3, -7, -8],    rot: [-Math.PI / 3, 0, 0], scale: [8, 4.5] }, 
  { pos: [4, -9, -20],    rot: [-Math.PI / 4, 0, 0], scale: [10, 6] },  
  
  // DEEP CENTER LEFT
  { pos: [-4, 1, -32],    rot: [0, Math.PI / 6, 0], scale: [5, 3] },    
];

interface StaticFixedImageProps {
  data: { pos: number[]; rot: number[]; scale: number[]; };
  index: number;
}

const StaticFixedImage = ({ data, index }: StaticFixedImageProps) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 500}`, [index]);
  
  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <group 
        position={data.pos as [number, number, number]} 
        rotation={data.rot as [number, number, number]}
      >
        <Image 
          url={url} 
          scale={[data.scale[0], data.scale[1]]} 
          transparent 
          opacity={0.9} 
          color="#bbbbbb" // Darkens images so the text pops
          toneMapped={false}
        />
      </group>
    </Float>
  );
};

const CentralLogo = () => {
  return (
    // Z=-12 places it cleanly in the center of the tunnel, dodging image overlaps
    <group position={[0, 0, -12]}> 
      <Text
        // FIX: Removed the buggy font URL. This uses the native default which WILL render.
        fontSize={5.5}
        scale={[1.4, 1, 1]} // Stretches it wide 
        letterSpacing={-0.08}
        color="#ffffff"
        // Force the text to look ultra-bold without needing a custom font file
        strokeWidth={0.05}
        strokeColor="#ffffff" 
        anchorX="center"
        anchorY="middle"
      >
        PANORAMA
      </Text>
      <Text
        fontSize={0.65}
        position={[0, -3.2, 0]}
        letterSpacing={1.2} 
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        FILMS
      </Text>
    </group>
  );
};

export default function TunnelScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
      
      {/* BACKGROUND VIDEO */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        >
          {/* REPLACE THIS SRC WITH YOUR ACTUAL BACKGROUND VIDEO URL */}
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
      </div>

      {/* FRAMER GRID OVERLAY */}
      <div className="framer-grid" style={{ zIndex: 1, position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      
      {/* 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: FOV_WARP }} 
        // alpha: true allows the video behind the canvas to show through
        gl={{ antialias: true, logarithmicDepthBuffer: true, alpha: true }} 
        style={{ position: 'relative', zIndex: 2 }}
      >
        <fog attach="fog" args={['#000000', 5, 45]} />
        <ambientLight intensity={1} />
        <group>
          <CentralLogo />
          {EXACT_FRAMER_LAYOUT.map((data, i) => (
            <StaticFixedImage key={i} data={data} index={i} />
          ))}
        </group>
      </Canvas>
    </div>
  );
}