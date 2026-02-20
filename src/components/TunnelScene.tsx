import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Float, Image, useVideoTexture } from "@react-three/drei";

/* ---------------- CAMERA ---------------- */
const FOV = 50;

/* ---------------- THE STRICT TUNNEL LAYOUT ---------------- */
// Mathematically building the 4 walls of the tunnel to match the Framer perspective box.
const PANELS = [
  // LEFT WALL (Angled inward at 60 degrees)
  { pos: [-6, 1, -4],    rot: [0, Math.PI / 3, 0], scale: [3, 1.8], type: 'video' },
  { pos: [-8, -2, -10],  rot: [0, Math.PI / 3, 0], scale: [4, 2.5], type: 'image' },
  { pos: [-10, 3, -16],  rot: [0, Math.PI / 3, 0], scale: [5, 3],   type: 'video' },

  // RIGHT WALL (Angled inward at -60 degrees)
  { pos: [6, -1, -4],    rot: [0, -Math.PI / 3, 0], scale: [3, 1.8], type: 'image' },
  { pos: [8, 2, -10],    rot: [0, -Math.PI / 3, 0], scale: [4, 2.5], type: 'video' },
  { pos: [10, -3, -16],  rot: [0, -Math.PI / 3, 0], scale: [5, 3],   type: 'image' },

  // CEILING / TOP WALL (Angled down at 60 degrees)
  { pos: [-2, 4.5, -6],  rot: [Math.PI / 3, 0, 0], scale: [3.5, 2],   type: 'image' },
  { pos: [3, 6.5, -12],  rot: [Math.PI / 3, 0, 0], scale: [4.5, 2.5], type: 'video' },

  // FLOOR / BOTTOM WALL (Angled up at -60 degrees)
  { pos: [2, -4.5, -6],  rot: [-Math.PI / 3, 0, 0], scale: [3.5, 2],   type: 'video' },
  { pos: [-3, -6.5, -12],rot: [-Math.PI / 3, 0, 0], scale: [4.5, 2.5], type: 'image' },

  // DEEP CENTER VOID
  { pos: [0, 0, -22],    rot: [0, 0, 0], scale: [6, 3.5], type: 'video' }
];

/* ---------------- MEDIA SOURCES ---------------- */
// Safe, open-source mp4s. Swap with your own later.
const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

/* ---------------- COMPONENTS ---------------- */
const VideoPlane = ({ data, url }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      {/* Keeping color dim so the text remains the brightest object */}
      <meshBasicMaterial map={texture} toneMapped={false} color="#888888" />
    </mesh>
  );
};

const ImagePlane = ({ data, index }: any) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 50}`, [index]);
  return (
    <Image 
      position={data.pos} 
      rotation={data.rot}
      url={url} 
      scale={data.scale} 
      transparent 
      opacity={0.9} 
      color="#888888" 
      toneMapped={false} 
    />
  );
};

const MediaPanel = ({ data, index }: any) => {
  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      {data.type === 'video' 
        ? <VideoPlane data={data} url={VIDEOS[index % VIDEOS.length]} />
        : <ImagePlane data={data} index={index} />
      }
    </Float>
  );
};

const CentralLogo = () => (
  // Pushed to Z=-8. Perfectly sized to avoid bleeding off the monitor.
  <group position={[0, 0, -8]}>
    <Text
      fontSize={0.8} // Safely scaled down. No more screen-breaking giant text.
      scale={[1.6, 1, 1]} // X-Stretch to brutally fake the custom Framer vector look
      letterSpacing={-0.05}
      color="#ffffff"
      strokeWidth={0.02} 
      strokeColor="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text
      fontSize={0.15}
      position={[0, -0.75, 0]}
      letterSpacing={1.8}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      FILMS
    </Text>
  </group>
);

/* ---------------- MAIN APP ---------------- */
export default function TunnelScene() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 1. BACKGROUND VIDEO (From your Framer DOM screenshot) */}
      <video
        autoPlay loop muted playsInline
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.25, zIndex: 0, pointerEvents: "none"
        }}
      >
        <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
      </video>

      {/* 2. CSS 2D GRID OVERLAY (Matches the Framer aesthetic perfectly) */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />

      {/* 3. 3D TUNNEL CANVAS */}
      <Canvas
        camera={{ position: [0, 0, 0], fov: FOV }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
      >
        {/* Global Suspense protects against black screen crashes if a texture fails to load */}
        <Suspense fallback={null}>
          <fog attach="fog" args={["#000000", 4, 25]} />
          <ambientLight intensity={1} />

          <CentralLogo />

          {PANELS.map((panel, i) => (
            <MediaPanel key={i} data={panel} index={i} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}