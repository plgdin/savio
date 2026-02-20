import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Float, useVideoTexture } from '@react-three/drei';

// Calibrated FOV to prevent the stretching you saw earlier
const FOV_WARP = 55; 

// The exact tunnel coordinate map, scaled to fit the camera
const EXACT_FRAMER_LAYOUT = [
  // LEFT WALL
  { pos: [-8, 1, -2],    rot: [0, Math.PI / 3, 0],   scale: [3.5, 2] },
  { pos: [-11, -3, -8],  rot: [0, Math.PI / 4, 0],   scale: [4.5, 2.5] },
  { pos: [-9, 4, -14],   rot: [0, Math.PI / 5, 0],   scale: [5, 3] },

  // RIGHT WALL
  { pos: [8, 2, -2],     rot: [0, -Math.PI / 3, 0],  scale: [3.5, 2] },
  { pos: [12, -2, -8],   rot: [0, -Math.PI / 4, 0],  scale: [4.5, 2.5] },
  { pos: [10, 5, -14],   rot: [0, -Math.PI / 5, 0],  scale: [5, 3] },

  // TOP WALL
  { pos: [-3, 6, -5],    rot: [Math.PI / 3, 0, 0],   scale: [4, 2.2] },
  { pos: [4, 8, -11],    rot: [Math.PI / 4, 0, 0],   scale: [5, 2.8] },

  // BOTTOM WALL
  { pos: [3, -6, -5],    rot: [-Math.PI / 3, 0, 0],  scale: [4, 2.2] },
  { pos: [-4, -8, -11],  rot: [-Math.PI / 4, 0, 0],  scale: [5, 2.8] },
];

// Open-source dummy videos to prove the video texture works. 
// Replace these URLs with your actual video assets.
const VIDEO_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

interface VideoPlaneProps {
  data: { pos: number[]; rot: number[]; scale: number[]; };
  url: string;
}

// Renders the actual video texture onto a 3D plane
const VideoPlane = ({ data, url }: VideoPlaneProps) => {
  const texture = useVideoTexture(url, { crossOrigin: 'Anonymous' });
  
  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <mesh 
        position={data.pos as [number, number, number]} 
        rotation={data.rot as [number, number, number]}
      >
        <planeGeometry args={[data.scale[0], data.scale[1]]} />
        {/* Dim the videos slightly with color so the central text stays the focus */}
        <meshBasicMaterial map={texture} toneMapped={false} color="#999999" />
      </mesh>
    </Float>
  );
};

// Wraps the video in Suspense because loading video textures takes a split second
const TunnelVideo = ({ data, index }: { data: any, index: number }) => {
  const url = VIDEO_URLS[index % VIDEO_URLS.length];
  
  return (
    <Suspense 
      fallback={
        <mesh position={data.pos} rotation={data.rot}>
          <planeGeometry args={data.scale} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      }
    >
      <VideoPlane data={data} url={url} />
    </Suspense>
  );
};

const CentralLogo = () => {
  return (
    <group position={[0, 0, -6]}> 
      <Text
        font="https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-Qxqse07RXg.woff"
        fontSize={1.8} // Fixed scale so it perfectly fits the screen
        scale={[1.6, 1, 1]} // Aggressive X-axis stretch to mimic the wide vector logo
        letterSpacing={-0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        PANORAMA
      </Text>
      <Text
        font="https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-Qxqse07RXg.woff"
        fontSize={0.25}
        position={[0, -1.2, 0]}
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
      
      {/* BACKGROUND VIDEO LAYER */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <video
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}
        >
          <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2D CSS GRID OVERLAY */}
      <div className="framer-grid" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
      
      {/* 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: FOV_WARP }} 
        gl={{ antialias: true, alpha: true }} 
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
        <fog attach="fog" args={['#000000', 3, 20]} />
        <ambientLight intensity={1} />
        
        <CentralLogo />

        {EXACT_FRAMER_LAYOUT.map((data, i) => (
          <TunnelVideo key={i} data={data} index={i} />
        ))}
      </Canvas>
    </div>
  );
}