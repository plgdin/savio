import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// 75 gives the precise tunnel depth from the original
const FOV_WARP = 75; 

// Placed to match the 12 specific image floating points
const EXACT_FRAMER_LAYOUT = [
  // LEFT WALL
  { pos: [-12, -1, -8], rot: [0, Math.PI / 3, 0], scale: [8, 5] },
  { pos: [-16, 3, -18], rot: [0, Math.PI / 4, 0], scale: [9, 5.5] },
  { pos: [-10, -5, -4], rot: [0, Math.PI / 2.5, 0], scale: [8, 4.5] }, 

  // RIGHT WALL
  { pos: [12, 4, -6], rot: [0, -Math.PI / 3, 0], scale: [9, 5.5] },
  { pos: [15, -1, -18], rot: [0, -Math.PI / 4, 0], scale: [9, 5] },
  { pos: [10, -4, -3], rot: [0, -Math.PI / 2.5, 0], scale: [8, 5] }, 

  // TOP WALL
  { pos: [-4, 6, -8], rot: [Math.PI / 3, 0, 0], scale: [7, 4] },
  { pos: [4, 7, -12], rot: [Math.PI / 4, 0, 0], scale: [8, 4.5] },
  { pos: [0, 5, -22], rot: [Math.PI / 6, 0, 0], scale: [6, 3.5] },  

  // BOTTOM WALL
  { pos: [-3, -6, -6], rot: [-Math.PI / 3, 0, 0], scale: [8, 4.5] },
  { pos: [4, -8, -15], rot: [-Math.PI / 4, 0, 0], scale: [9, 5.5] },

  // DEEP CENTER LEFT
  { pos: [-4, 1, -25], rot: [0, Math.PI / 6, 0], scale: [5, 3] },
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
          opacity={0.95}
          color="#a0a0a0" // Darken images to push them back visually
          toneMapped={false}
        />
      </group>
    </Float>
  );
};

const CentralLogo = () => {
  return (
    // Pushed closer (Z=-8 instead of -15) so the fog doesn't turn it gray
    <group position={[0, 0, -8]}> 
      <Text
        // Using a known heavy Google Font (Montserrat Black) to force the thickness
        font="https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-Qxqse07RXg.woff"
        fontSize={3.5}
        scale={[1.5, 1, 1]} // Stretching it wide like the vector logo
        letterSpacing={-0.1}
        color="#ffffff"
        fillOpacity={1}
      >
        PANORAMA
      </Text>
      <Text
        font="https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-Qxqse07RXg.woff"
        fontSize={0.4}
        position={[0, -1.8, 0]}
        letterSpacing={1.5} 
        color="#ffffff"
      >
        FILMS
      </Text>
    </group>
  );
};

export default function TunnelScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>

      {/* 1. BACKGROUND VIDEO */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} // Adjust opacity to blend with the tunnel
        >
          {/* REPLACE THIS SRC WITH YOUR ACTUAL BACKGROUND VIDEO URL */}
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. FRAMER GRID OVERLAY */}
      <div className="framer-grid" style={{ zIndex: 1, position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* 3. 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: FOV_WARP }} 
        gl={{ antialias: true, logarithmicDepthBuffer: true, alpha: true }} // alpha: true lets the video show through
        style={{ position: 'relative', zIndex: 2 }}
      >
        <fog attach="fog" args={['#000000', 5, 35]} />
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