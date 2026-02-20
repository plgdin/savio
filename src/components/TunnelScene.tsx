import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Float, Image, useVideoTexture } from "@react-three/drei";

/* ---------------- CAMERA ---------------- */
// Cranked to 65 to get that deep, stretched cinematic perspective
const FOV = 65; 

/* ---------------- THE TIGHT COLLAGE LAYOUT ---------------- */
// Coordinates manually squeezed inward to hug the text and overlap slightly, 
// matching the exact claustrophobic tunnel feel of the Framer reference.
const PANELS = [
  // CLOSE RING
  { pos: [-3.5, 0.5, 1],   rot: [0, Math.PI / 4, 0],  scale: [2.5, 1.5], type: 'video' },
  { pos: [3.5, -0.5, 1],   rot: [0, -Math.PI / 4, 0], scale: [2.5, 1.5], type: 'video' },
  
  // MID RING (Left)
  { pos: [-5, -2, -2],     rot: [0, Math.PI / 4, 0],  scale: [2.8, 1.7], type: 'image' },
  { pos: [-6, 2.5, -5],    rot: [0, Math.PI / 4, 0],  scale: [3, 1.8],   type: 'image' },
  { pos: [-7, -1, -8],     rot: [0, Math.PI / 4, 0],  scale: [3.5, 2],   type: 'video' },

  // MID RING (Right)
  { pos: [5, 2, -2],       rot: [0, -Math.PI / 4, 0], scale: [2.8, 1.7], type: 'image' },
  { pos: [6, -2.5, -5],    rot: [0, -Math.PI / 4, 0], scale: [3, 1.8],   type: 'video' },
  { pos: [7, 1, -8],       rot: [0, -Math.PI / 4, 0], scale: [3.5, 2],   type: 'image' },

  // TOP WALL (Ceiling)
  { pos: [-1.5, 3.5, -1],  rot: [Math.PI / 4, 0, 0],  scale: [2.5, 1.5], type: 'image' },
  { pos: [2, 4.5, -4],     rot: [Math.PI / 4, 0, 0],  scale: [3, 1.8],   type: 'video' },

  // BOTTOM WALL (Floor)
  { pos: [1.5, -3.5, -1],  rot: [-Math.PI / 4, 0, 0], scale: [2.5, 1.5], type: 'image' },
  { pos: [-2, -4.5, -4],   rot: [-Math.PI / 4, 0, 0], scale: [3, 1.8],   type: 'video' },

  // DEEP BACKGROUND
  { pos: [-1, -0.5, -12],  rot: [0, 0.1, 0],          scale: [4, 2.5],   type: 'image' },
  { pos: [2, 1, -15],      rot: [0, -0.1, 0],         scale: [4.5, 2.8], type: 'video' }
];

/* ---------------- MEDIA SOURCES ---------------- */
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
      {/* Dimmed so the white logo cuts through the noise */}
      <meshBasicMaterial map={texture} toneMapped={false} color="#999999" />
    </mesh>
  );
};

const ImagePlane = ({ data, index }: any) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 200}`, [index]);
  return (
    <Image 
      position={data.pos} 
      rotation={data.rot}
      url={url} 
      scale={data.scale} 
      transparent 
      opacity={0.9} 
      color="#999999" 
      toneMapped={false} 
    />
  );
};

const MediaPanel = ({ data, index }: any) => {
  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
      {data.type === 'video' 
        ? <VideoPlane data={data} url={VIDEOS[index % VIDEOS.length]} />
        : <ImagePlane data={data} index={index} />
      }
    </Float>
  );
};

const CentralLogo = () => (
  // Z=-3 sits just behind the close ring of images, creating tight overlap
  <group position={[0, 0, -3]}>
    <Text
      fontSize={1.2} 
      scale={[1.8, 1, 1]} // Aggressively stretched X-axis
      letterSpacing={-0.08} // Squashed letters
      color="#ffffff"
      // This is the magic. Forcing a massive stroke width artificially 
      // turns the thin default font into a heavy, blocky logo.
      strokeWidth={0.06} 
      strokeColor="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text
      fontSize={0.2}
      position={[0, -0.9, 0]}
      letterSpacing={2}
      color="#ffffff"
      strokeWidth={0.005} // Subtle thickness for the subtext
      strokeColor="#ffffff"
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
      {/* 1. BACKGROUND VIDEO */}
      <video
        autoPlay loop muted playsInline
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.25, zIndex: 0, pointerEvents: "none"
        }}
      >
        <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
      </video>

      {/* 2. CSS 2D GRID OVERLAY */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />

      {/* 3. 3D TUNNEL CANVAS */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: FOV }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#000000", 2, 18]} />
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