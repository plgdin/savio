import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';

// A tighter FOV prevents the extreme stretching on the edges
const FOV_WARP = 65; 

// Placed to mimic the exact scatter pattern in your Framer screenshot
const SCATTER_DATA = [
  // Top Left cluster
  { pos: [-8, 4, 2], rot: [0.2, Math.PI / 6, 0], scale: [7, 4.5] },
  { pos: [-10, 1, 5], rot: [0.1, Math.PI / 5, 0], scale: [6, 4] },
  
  // Bottom Left cluster
  { pos: [-9, -4, 4], rot: [-0.2, Math.PI / 6, 0], scale: [7, 4.5] },
  { pos: [-5, -6, 0], rot: [-0.3, Math.PI / 8, 0], scale: [8, 5] },
  
  // Top Right cluster
  { pos: [8, 5, 0], rot: [0.2, -Math.PI / 6, 0], scale: [8, 5] },
  { pos: [10, 1, 6], rot: [0.1, -Math.PI / 5, 0], scale: [6, 4] },
  
  // Bottom Right cluster
  { pos: [9, -4, 2], rot: [-0.2, -Math.PI / 6, 0], scale: [7, 4.5] },
  { pos: [6, -7, 0], rot: [-0.3, -Math.PI / 8, 0], scale: [8, 5] },

  // Center-ish Top & Bottom
  { pos: [0, 6, -5], rot: [0.4, 0, 0], scale: [9, 5] },
  { pos: [0, -6, -2], rot: [-0.4, 0, 0], scale: [8, 5] },
  
  // Far Background for depth
  { pos: [-4, 2, -10], rot: [0, 0.2, 0], scale: [5, 3] },
  { pos: [4, -2, -12], rot: [0, -0.2, 0], scale: [6, 3.5] },
];

interface StaticFixedImageProps {
  data: { pos: number[]; rot: number[]; scale: number[]; };
  index: number;
}

const StaticFixedImage = ({ data, index }: StaticFixedImageProps) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 300}`, [index]);
  
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group 
        position={data.pos as [number, number, number]} 
        rotation={data.rot as [number, number, number]}
      >
        {/* Borders are gone. Opacity is 1 for vibrant colors. */}
        <Image 
          url={url} 
          scale={[data.scale[0], data.scale[1]]} 
          transparent 
          opacity={1} 
          toneMapped={false}
        />
      </group>
    </Float>
  );
};

const CentralLogo = () => {
  return (
    <group position={[0, 0, -8]}> 
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={5}
        // X-scale at 1.4 forces the font to be ultra-wide and blocky
        scale={[1.4, 1, 1]} 
        letterSpacing={-0.08}
        color="white"
        fontWeight={900}
      >
        PANORAMA
      </Text>
      <Text
        fontSize={0.6}
        position={[0, -2.5, 0]}
        letterSpacing={1.5} 
        color="white"
        fontWeight={400}
      >
        FILMS
      </Text>
    </group>
  );
};

export default function TunnelScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas 
        camera={{ position: [0, 0, 15], fov: FOV_WARP }} 
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 40]} />
        <group>
          {/* WireframeTube is completely deleted. It was ruining the render. */}
          <CentralLogo />
          {SCATTER_DATA.map((data, i) => (
            <StaticFixedImage key={i} data={data} index={i} />
          ))}
        </group>
      </Canvas>
    </div>
  );
}