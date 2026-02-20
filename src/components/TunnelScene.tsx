import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// FOV 80 creates the compressed cinematic perspective seen in the reference
const FOV_WARP = 80; 

const TUNNEL_DATA = [
  // LEFT SIDE - Dynamic spacing to avoid the "boxy" look
  { pos: [-10, 2, 12],   rot: [0, Math.PI / 4, 0],   scale: [9, 6] }, 
  { pos: [-11, -3, 6],   rot: [0, Math.PI / 3, 0],   scale: [8, 5] },
  { pos: [-12, 4, -2],   rot: [0, Math.PI / 2, 0],   scale: [10, 6] },
  { pos: [-11, -1, -10], rot: [0, Math.PI / 2.5, 0], scale: [7, 5] },
  { pos: [-10, 5, -18],  rot: [0, Math.PI / 3, 0],   scale: [9, 6] },

  // RIGHT SIDE - Overlapping depths for a collage feel
  { pos: [10, 3, 10],    rot: [0, -Math.PI / 4, 0],  scale: [9, 6] }, 
  { pos: [11, -4, 4],    rot: [0, -Math.PI / 3, 0],  scale: [8, 5.5] },
  { pos: [12, 1, -5],    rot: [0, -Math.PI / 2, 0],  scale: [11, 7] },
  { pos: [11, 5, -12],   rot: [0, -Math.PI / 2.5, 0], scale: [8, 5] },

  // TOP & BOTTOM - Filling the peripheral vision
  { pos: [0, 8, 5],      rot: [Math.PI / 2, 0, 0],   scale: [12, 8] }, 
  { pos: [-5, -8, 2],    rot: [-Math.PI / 2, 0, 0],  scale: [10, 6] },
  { pos: [5, -8, -8],    rot: [-Math.PI / 2, 0, 0],  scale: [9, 6] },
  { pos: [0, 8, -20],    rot: [Math.PI / 2, 0, 0],   scale: [8, 5] },
];

interface StaticFixedImageProps {
  data: { pos: number[]; rot: number[]; scale: number[]; };
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
          opacity={0.85}
          color="#999999" // Tinting images darker ensures the central white text "pops"
          toneMapped={false}
        />
        {/* Subtle border to define the image edges against the black void */}
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
  // Offsets are wider than the image positions to stop the grid from clipping through images
  const wallOffset = 14.5;
  const floorOffset = 10.5;

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
        scale={[1.25, 0.85, 1]} // Squashing height + extending width for that heavy cinematic logo
        letterSpacing={-0.08}
        color="white"
        fontWeight={900}
      >
        PANORAMA
      </Text>
      <Text
        fontSize={0.7}
        position={[0, -3.4, 0]}
        letterSpacing={1.1} 
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
          logarithmicDepthBuffer: true // Fixes flickering for overlapping 3D objects
        }}
      >
        <color attach="background" args={['#000000']} />
        {/* Fog depth ensures background elements fade perfectly into the black background */}
        <fog attach="fog" args={['#000000', 5, 55]} />
        <ambientLight intensity={0.5} />
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