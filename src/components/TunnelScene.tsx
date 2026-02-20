import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- Configuration ---
// Lower FOV creates the compressed "tunnel" perspective from the reference
const FOV_WARP = 80; 

const TUNNEL_DATA = [
  // --- LEFT SIDE ---
  { pos: [-10, 2, 12],   rot: [0, Math.PI / 4, 0],   scale: [9, 6] }, 
  { pos: [-11, -3, 6],   rot: [0, Math.PI / 3, 0],   scale: [8, 5] },
  { pos: [-12, 4, -2],   rot: [0, Math.PI / 2, 0],   scale: [10, 6] },
  { pos: [-11, -1, -10], rot: [0, Math.PI / 2.5, 0], scale: [7, 5] },
  { pos: [-10, 5, -18],  rot: [0, Math.PI / 3, 0],   scale: [9, 6] },

  // --- RIGHT SIDE ---
  { pos: [10, 3, 10],    rot: [0, -Math.PI / 4, 0],  scale: [9, 6] }, 
  { pos: [11, -4, 4],    rot: [0, -Math.PI / 3, 0],  scale: [8, 5.5] },
  { pos: [12, 1, -5],    rot: [0, -Math.PI / 2, 0],  scale: [11, 7] },
  { pos: [11, 5, -12],   rot: [0, -Math.PI / 2.5, 0], scale: [8, 5] },

  // --- TOP / BOTTOM FILLERS ---
  { pos: [0, 8, 5],      rot: [Math.PI / 2, 0, 0],   scale: [12, 8] }, 
  { pos: [-5, -8, 2],    rot: [-Math.PI / 2, 0, 0],  scale: [10, 6] },
  { pos: [5, -8, -8],    rot: [-Math.PI / 2, 0, 0],  scale: [9, 6] },
  { pos: [0, 8, -20],    rot: [Math.PI / 2, 0, 0],   scale: [8, 5] },
];

interface StaticFixedImageProps {
  data: {
    pos: number[];
    rot: number[];
    scale: number[];
  };
  index: number;
}

const StaticFixedImage = ({ data, index }: StaticFixedImageProps) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 200}`, [index]);
  
  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
      <group 
        position={data.pos as [number, number, number]} 
        rotation={data.rot as [number, number, number]}
      >
        <Image 
          url={url} 
          scale={[data.scale[0], data.scale[1]]} 
          transparent 
          opacity={0.8}
          // DIMMING FIX: Use color tinting instead of the non-existent 'brightness' prop
          color="#888888" 
          toneMapped={false}
        />
        <lineSegments>
           <edgesGeometry args={[new THREE.PlaneGeometry(data.scale[0], data.scale[1])]} />
          <lineBasicMaterial color="#333" transparent opacity={0.3} />
        </lineSegments>
      </group>
    </Float>
  );
};

const WireframeTube = () => {
  const size = 150;
  const divisions = 60;
  // Pushing the grid slightly further out than the images to prevent clipping/overlapping
  const wallOffset = 14;
  const floorOffset = 10;

  return (
    <group position={[0, 0, -30]}>
      <gridHelper args={[size, divisions, "#111", "#050505"]} position={[0, -floorOffset, 0]} />
      <gridHelper args={[size, divisions, "#111", "#050505"]} position={[0, floorOffset, 0]} />
      <gridHelper 
        args={[size, divisions, "#111", "#050505"]}
        position={[-wallOffset, 0, 0]} 
        rotation={[0, 0, Math.PI / 2]} 
      />
      <gridHelper 
        args={[size, divisions, "#111", "#050505"]}
        position={[wallOffset, 0, 0]} 
        rotation={[0, 0, Math.PI / 2]} 
      />
    </group>
  );
};

const CentralLogo = () => {
  return (
    <group position={[0, 0, -25]}> 
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={6.5}
        scale={[1.2, 0.85, 1]} // Squashed height + extended width for a heavy look
        letterSpacing={-0.06}
        color="white"
        fontWeight={900}
      >
        PANORAMA
      </Text>
      <Text
        fontSize={0.7}
        position={[0, -3.4, 0]}
        letterSpacing={1} 
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
        camera={{ position: [0, 0, 20], fov: FOV_WARP }} 
        gl={{ 
            antialias: true,
          logarithmicDepthBuffer: true // Fixes z-fighting on overlapping images
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 55]} />
        <ambientLight intensity={0.4} />
        <group>
          <WireframeTube />
          <CentralLogo />
          {TUNNEL_DATA.map((data, i) => (
            <StaticFixedImage key={i} data={data} index={i} />
          ))}
        </group>
      </Canvas>
    </div>
  );
}