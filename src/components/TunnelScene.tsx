import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Float, Html } from '@react-three/drei';

const FOV_WARP = 50; 

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
        color="#aaaaaa" 
        toneMapped={false} 
      />
    </Float>
  );
};

const CentralLogo = () => {
  return (
    // <Html transform center> embeds real DOM elements flawlessly into the 3D scene
    <Html transform center position={[0, 0, -6]} zIndexRange={[100, 0]}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
        <h1 style={{
          fontFamily: 'Impact, Arial Black, sans-serif',
          fontSize: '10rem', // Massive size, but rendered cleanly via CSS
          color: '#ffffff',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          transform: 'scaleX(1.4)', // Horizontal stretch to mimic the wide Framer logo
          whiteSpace: 'nowrap',
          textShadow: '0px 0px 20px rgba(0,0,0,0.8)' // Forces it to pop through the fog
        }}>
          PANORAMA
        </h1>
        <p style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.2rem',
          color: '#ffffff',
          letterSpacing: '1.5em',
          margin: 0,
          marginTop: '-5px',
          whiteSpace: 'nowrap',
          transform: 'translateX(0.75em)', // Offset to visually balance the heavy letter spacing
          textShadow: '0px 0px 10px rgba(0,0,0,0.8)'
        }}>
          FILMS
        </p>
      </div>
    </Html>
  );
};

export default function TunnelScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
      
      {/* BACKGROUND VIDEO */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <video
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        >
          <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
        </video>
      </div>

      {/* CSS 2D GRID OVERLAY */}
      <div className="framer-grid" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
      
      {/* 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: FOV_WARP }} 
        gl={{ antialias: true, alpha: true }} 
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
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