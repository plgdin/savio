import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Configuration ---
const FOV_WARP = 125; 

const TUNNEL_DATA = [
  // --- LEFT WALL (X = -12) ---
  { pos: [-12, 0, 5],    rot: [0, Math.PI / 2, 0],   scale: [16, 10] }, 
  { pos: [-12, 5, -8],   rot: [0, Math.PI / 2, 0],   scale: [9, 6] },
  { pos: [-12, -5, -10], rot: [0, Math.PI / 2, 0],   scale: [11, 7] },
  { pos: [-12, 0, -25],  rot: [0, Math.PI / 2, 0],   scale: [7, 5] },

  // --- RIGHT WALL (X = 12) ---
  { pos: [12, 4, 4],     rot: [0, -Math.PI / 2, 0],  scale: [16, 9] }, 
  { pos: [12, -4, -5],   rot: [0, -Math.PI / 2, 0],  scale: [10, 6] },
  { pos: [12, 0, -18],   rot: [0, -Math.PI / 2, 0],  scale: [8, 5.5] },

  // --- CEILING (Y = 8) ---
  { pos: [0, 8, 5],      rot: [Math.PI / 2, 0, 0],   scale: [18, 11] }, 
  { pos: [6, 8, -6],     rot: [Math.PI / 2, 0, 0],   scale: [9, 6] },
  { pos: [-6, 8, -12],   rot: [Math.PI / 2, 0, 0],   scale: [10, 6] },
  { pos: [0, 8, -25],    rot: [Math.PI / 2, 0, 0],   scale: [8, 5] },

  // --- FLOOR (Y = -8) ---
  { pos: [0, -8, 5],     rot: [-Math.PI / 2, 0, 0],  scale: [18, 11] }, 
  { pos: [-7, -8, -5],   rot: [-Math.PI / 2, 0, 0],  scale: [10, 6] },
  { pos: [7, -8, -15],   rot: [-Math.PI / 2, 0, 0],  scale: [9, 6] },
  { pos: [0, -8, -28],   rot: [-Math.PI / 2, 0, 0],  scale: [7, 5] },
];

const StaticFixedImage = ({ data, index }: { data: any, index: number }) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 150}`, [index]);
  return (
    <group position={data.pos} rotation={data.rot}>
      <Image url={url} scale={data.scale} transparent opacity={1} />
      <lineSegments>
         <edgesGeometry args={[new THREE.PlaneGeometry(data.scale[0], data.scale[1])]} />
         <lineBasicMaterial color="#444" />
      </lineSegments>
    </group>
  );
};

// THE FIX: Rectangular Tube Wireframe
// We use 4 GridHelpers positioned to form the 4 inner faces of the tube.
// This ensures continuous lines from foreground to background.
const WireframeTube = () => {
  const gridColor = "#1a1a1a";
  const sectionColor = "#333333";
  const size = 100; // How long the tube is
  const divisions = 40; // How many lines in the grid

  return (
    <group position={[0, 0, -20]}>
      {/* Floor Grid */}
      <gridHelper args={[size, divisions, sectionColor, gridColor]} position={[0, -8.1, 0]} />
      
      {/* Ceiling Grid */}
      <gridHelper args={[size, divisions, sectionColor, gridColor]} position={[0, 8.1, 0]} />
      
      {/* Left Wall Grid */}
      <gridHelper 
        args={[size, divisions, sectionColor, gridColor]} 
        position={[-12.1, 0, 0]} 
        rotation={[0, 0, Math.PI / 2]} 
      />
      
      {/* Right Wall Grid */}
      <gridHelper 
        args={[size, divisions, sectionColor, gridColor]} 
        position={[12.1, 0, 0]} 
        rotation={[0, 0, Math.PI / 2]} 
      />
    </group>
  );
};

const CentralLogo = () => {
  return (
    <group position={[0, 0, -20]}> 
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={5}
        letterSpacing={-0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        PANORAMA
      </Text>
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={0.7}
        position={[0, -2.5, 0]}
        letterSpacing={0.6}
        color="white"
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
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas 
        camera={{ position: [0, 0, 16], fov: FOV_WARP }} 
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 80]} />
        
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