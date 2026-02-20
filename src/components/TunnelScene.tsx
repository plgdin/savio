import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';

// 75 gives the exact optical depth seen in the Framer reference
const FOV_WARP = 75; 

// Mapped exactly to the 12 images in the original screenshot
const EXACT_FRAMER_LAYOUT = [
  // LEFT WALL
  { pos: [-12, -1, -12], rot: [0, Math.PI / 3, 0], scale: [8, 5] },
  { pos: [-18, 3, -25], rot: [0, Math.PI / 4, 0], scale: [10, 6] },
  { pos: [-10, -5, -6], rot: [0, Math.PI / 2.5, 0], scale: [9, 5] }, 

  // RIGHT WALL
  { pos: [12, 4, -8], rot: [0, -Math.PI / 3, 0], scale: [10, 6] },
  { pos: [16, -1, -22], rot: [0, -Math.PI / 4, 0], scale: [9, 5] },
  { pos: [10, -4, -5], rot: [0, -Math.PI / 2.5, 0], scale: [8, 5] }, 

  // TOP WALL
  { pos: [-5, 7, -10], rot: [Math.PI / 3, 0, 0], scale: [7, 4] },
  { pos: [4, 8, -15], rot: [Math.PI / 4, 0, 0], scale: [8, 4.5] },
  { pos: [0, 5, -28], rot: [Math.PI / 6, 0, 0], scale: [6, 3.5] },  

  // BOTTOM WALL
  { pos: [-3, -7, -8], rot: [-Math.PI / 3, 0, 0], scale: [8, 4.5] },
  { pos: [4, -9, -20], rot: [-Math.PI / 4, 0, 0], scale: [10, 6] },

  // DEEP CENTER LEFT
  { pos: [-4, 1, -32], rot: [0, Math.PI / 6, 0], scale: [5, 3] },
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
          toneMapped={false}
        />
      </group>
    </Float>
  );
};

const CentralLogo = () => {
  return (
    // Pushed back to Z = -15 so it sits properly inside the tunnel
    <group position={[0, 0, -15]}> 
      <Text
        fontSize={5}
        scale={[1.4, 1, 1]} // Stretches it wide like the original
        letterSpacing={-0.08}
        color="#ffffff"
        fontWeight={900}
        // Outline stroke guarantees it looks ultra-thick
        strokeWidth={0.05}
        strokeColor="#ffffff" 
      >
        PANORAMA
      </Text>
      <Text
        fontSize={0.6}
        position={[0, -2.8, 0]}
        letterSpacing={1.2}
        color="#ffffff"
        fontWeight={400}
      >
        FILMS
      </Text>
    </group>
  );
};

export default function TunnelScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      {/* The 2D Grid Background overlay */}
      <div className="framer-grid" />

      <Canvas 
        camera={{ position: [0, 0, 5], fov: FOV_WARP }}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        style={{ zIndex: 1 }}
      >
        <color attach="background" args={['transparent']} /> {/* Transparent to show grid */}
        <fog attach="fog" args={['#000000', 10, 45]} />
        <ambientLight intensity={0.6} />
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