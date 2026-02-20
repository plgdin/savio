import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';

// Tighter FOV to reduce edge distortion while keeping the depth
const FOV_WARP = 50; 

// Values have been drastically reduced and pushed outwards to form a wide, clear funnel
const EXACT_FRAMER_LAYOUT = [
  // LEFT WALL
  { pos: [-9, 1, -2],    rot: [0, Math.PI / 3, 0],   scale: [3.5, 2] },
  { pos: [-12, -3, -8],  rot: [0, Math.PI / 4, 0],   scale: [4.5, 2.5] },
  { pos: [-10, 4, -15],  rot: [0, Math.PI / 5, 0],   scale: [5, 3] },

  // RIGHT WALL
  { pos: [9, 2, -2],     rot: [0, -Math.PI / 3, 0],  scale: [3.5, 2] },
  { pos: [13, -2, -8],   rot: [0, -Math.PI / 4, 0],  scale: [4.5, 2.5] },
  { pos: [11, 5, -15],   rot: [0, -Math.PI / 5, 0],  scale: [5, 3] },

  // TOP WALL
  { pos: [-3, 7, -5],    rot: [Math.PI / 3, 0, 0],   scale: [4, 2.2] },
  { pos: [4, 9, -12],    rot: [Math.PI / 4, 0, 0],   scale: [5, 2.8] },

  // BOTTOM WALL
  { pos: [3, -7, -5],    rot: [-Math.PI / 3, 0, 0],  scale: [4, 2.2] },
  { pos: [-4, -9, -12],  rot: [-Math.PI / 4, 0, 0],  scale: [5, 2.8] },

  // DEEP BACKGROUND
  { pos: [0, 0, -25],    rot: [0, 0, 0],             scale: [7, 4] },
];

interface StaticFixedImageProps {
  data: { pos: number[]; rot: number[]; scale: number[]; };
  index: number;
}

const StaticFixedImage = ({ data, index }: StaticFixedImageProps) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 100}`, [index]);
  
  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <Image 
        position={data.pos as [number, number, number]} 
        rotation={data.rot as [number, number, number]}
        url={url} 
        scale={[data.scale[0], data.scale[1]]} 
        transparent 
        opacity={0.9} 
        color="#aaaaaa" // Keeps images slightly dim so the logo pops
        toneMapped={false} 
      />
    </Float>
  );
};

const CentralLogo = () => {
  return (
    // Pushed back to Z=-6 so it sits neatly in the middle of the tunnel
    <group position={[0, 0, -6]}> 
      <Text
        fontSize={1.2} // Drastically reduced so it never bleeds off the screen
        scale={[1.4, 1, 1]} // Horizontal stretch for the heavy vector look
        letterSpacing={-0.05}
        color="#ffffff"
        fontWeight={900}
        anchorX="center"
        anchorY="middle"
      >
        PANORAMA
      </Text>
      <Text
        fontSize={0.18}
        position={[0, -0.8, 0]}
        letterSpacing={2} 
        color="#ffffff"
        fontWeight={400}
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
      
      {/* 1. BACKGROUND VIDEO */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <video
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        >
          <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. CSS 2D GRID OVERLAY (Uses your existing CSS class) */}
      <div className="framer-grid" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
      
      {/* 3. 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: FOV_WARP }} 
        gl={{ antialias: true, alpha: true }} 
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
        {/* Fog tightened to match the new scale geometry */}
        <fog attach="fog" args={['#000000', 3, 22]} />
        <ambientLight intensity={1} />
        
        <CentralLogo />

        {EXACT_FRAMER_LAYOUT.map((data, i) => (
          <StaticFixedImage key={i} data={data} index={i} />
        ))}
      </Canvas>
    </div>
  );
}