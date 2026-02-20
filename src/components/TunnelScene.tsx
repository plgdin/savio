import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Exact math from the Framer DOM screenshot
const DEG2RAD = Math.PI / 180;
const FOV_WARP = 65; 

interface ImageProps {
  pos: [number, number, number];
  scale: [number, number];
  index: number;
}

const TunnelImage = ({ pos, scale, index }: ImageProps) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 100}`, [index]);
  
  return (
    <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.05}>
      <Image 
        position={pos} 
        url={url} 
        scale={scale} 
        transparent 
        opacity={0.9} 
        color="#c0c0c0" // Dims images slightly to match the Framer vibe
        toneMapped={false} 
      />
    </Float>
  );
};

const CentralLogo = () => {
  return (
    <group position={[0, 0, -8]}> 
      <Text
        fontSize={4.5}
        scale={[1.6, 1, 1]} // Aggressively stretches the X-axis to mimic the custom vector logo
        letterSpacing={-0.08}
        color="#ffffff"
        strokeWidth={0.03}
        strokeColor="#ffffff" 
        anchorX="center"
        anchorY="middle"
      >
        PANORAMA
      </Text>
      <Text
        fontSize={0.5}
        position={[0, -2.5, 0]}
        letterSpacing={1.8} 
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
      
      {/* EXACT FRAMER BACKGROUND VIDEO */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        >
          {/* Sourced directly from your DOM screenshot */}
          <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
        </video>
      </div>

      {/* CSS 2D GRID - Prevents 3D clipping */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />
      
      {/* 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: FOV_WARP }} 
        gl={{ antialias: true, alpha: true }} 
        style={{ position: 'relative', zIndex: 2 }}
      >
        <fog attach="fog" args={['#000000', 8, 30]} />
        <ambientLight intensity={1} />
        
        <CentralLogo />

        {/* THE FRAMER BOX ARCHITECTURE 
          Instead of scattering randomly, we create the exact 4 walls from the DOM.
        */}

        {/* LEFT WALL: rotateY(55deg) */}
        <group position={[-14, 0, -10]} rotation={[0, 55 * DEG2RAD, 0]}>
          <TunnelImage pos={[0, 2, 4]} scale={[8, 5]} index={1} />
          <TunnelImage pos={[0, -4, -2]} scale={[7, 4.5]} index={2} />
          <TunnelImage pos={[0, 5, -8]} scale={[9, 5.5]} index={3} />
        </group>

        {/* RIGHT WALL: rotateY(-55deg) */}
        <group position={[14, 0, -10]} rotation={[0, -55 * DEG2RAD, 0]}>
          <TunnelImage pos={[0, 3, 2]} scale={[9, 5.5]} index={4} />
          <TunnelImage pos={[0, -3, -4]} scale={[8, 5]} index={5} />
          <TunnelImage pos={[0, 4, -10]} scale={[7, 4]} index={6} />
        </group>

        {/* SKY/CEILING: rotateX(-73deg) */}
        <group position={[0, 10, -10]} rotation={[-73 * DEG2RAD, 0, 0]}>
          <TunnelImage pos={[-5, 0, 2]} scale={[8, 4.5]} index={7} />
          <TunnelImage pos={[6, 0, -4]} scale={[9, 5]} index={8} />
        </group>

        {/* FLOOR: rotateX(73deg) */}
        <group position={[0, -10, -10]} rotation={[73 * DEG2RAD, 0, 0]}>
          <TunnelImage pos={[-4, 0, 0]} scale={[9, 5]} index={9} />
          <TunnelImage pos={[5, 0, -6]} scale={[10, 6]} index={10} />
        </group>

      </Canvas>
    </div>
  );
}