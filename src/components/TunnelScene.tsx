import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';

// A narrower FOV keeps the edges from stretching and distorting
const FOV_WARP = 60; 

// Scaled down and manually positioned to form the perfect 3D funnel 
// without blowing past the camera's viewport bounds.
const EXACT_FRAMER_LAYOUT = [
  // LEFT WALL
  { pos: [-6, 0, 2],      rot: [0, 0.6, 0], scale: [3.5, 2.2] },  // Close
  { pos: [-9, -2.5, -2],  rot: [0, 0.5, 0], scale: [4.5, 2.8] },  // Mid
  { pos: [-12, 3, -6],    rot: [0, 0.4, 0], scale: [5.5, 3.2] },  // Far

  // RIGHT WALL
  { pos: [6, 1.5, 2],     rot: [0, -0.6, 0], scale: [3.5, 2.2] }, // Close
  { pos: [9, -2, -2],     rot: [0, -0.5, 0], scale: [4.5, 2.8] }, // Mid
  { pos: [12, 4, -6],     rot: [0, -0.4, 0], scale: [5.5, 3.2] }, // Far

  // TOP WALL
  { pos: [-2, 4.5, 1],    rot: [0.6, 0, 0], scale: [3.5, 2.2] },  // Close
  { pos: [3, 6, -3],      rot: [0.5, 0, 0], scale: [4.5, 2.8] },  // Mid
  { pos: [0, 8, -7],      rot: [0.4, 0, 0], scale: [5.5, 3.2] },  // Far

  // BOTTOM WALL
  { pos: [2, -4.5, 1],    rot: [-0.6, 0, 0], scale: [3.5, 2.2] }, // Close
  { pos: [-3, -6, -3],    rot: [-0.5, 0, 0], scale: [4.5, 2.8] }, // Mid
  { pos: [0, -8, -7],     rot: [-0.4, 0, 0], scale: [5.5, 3.2] }, // Far
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
        color="#b0b0b0" // Darkens images so the bright white text remains the focus
        toneMapped={false} 
      />
    </Float>
  );
};

const CentralLogo = () => {
  return (
    // Positioned deep enough to sit behind the front images, but forward enough to stay crisp
    <group position={[0, 0, -2]}> 
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={1.8} // Fixed: Scaled down drastically to fit the screen
        scale={[1.3, 1, 1]} // X-Stretch to mimic the custom vector logo
        letterSpacing={-0.06}
        color="#ffffff"
        fontWeight={900}
        anchorX="center"
        anchorY="middle"
      >
        PANORAMA
      </Text>
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={0.25}
        position={[0, -1.1, 0]}
        letterSpacing={1.8} 
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
          {/* Framer Video URL */}
          <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. CSS 2D GRID OVERLAY */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />
      
      {/* 3. 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 0, 8], fov: FOV_WARP }} // Pushed camera back to Z=8 to see the whole scene
        gl={{ antialias: true, alpha: true }} 
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
        {/* Fog creates the depth fade. Starts at Z=2, completely black by Z=18 */}
        <fog attach="fog" args={['#000000', 2, 18]} />
        <ambientLight intensity={1} />
        
        <CentralLogo />

        {EXACT_FRAMER_LAYOUT.map((data, i) => (
          <StaticFixedImage key={i} data={data} index={i} />
        ))}
      </Canvas>
    </div>
  );
}