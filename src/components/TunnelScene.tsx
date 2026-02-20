import React, { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Image, ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";

const FOV = 65; 

/* ---------------- CONTROLLED CHAOS LAYOUT ---------------- */
const PANELS = [
  // CLOSE RING (Framing the entrance)
  { pos: [-4.5, 1.2, -1],    rot: [0.1, Math.PI / 5, 0.05],   scale: [2.5, 1.5], type: 'video_placeholder' },
  { pos: [5.2, -1.5, -1.5],  rot: [-0.1, -Math.PI / 6, 0],    scale: [2.8, 1.7], type: 'video_placeholder' },

  // MID RING (The core walls)
  { pos: [-7.5, -2, -5],     rot: [0, Math.PI / 4, 0.1],      scale: [3.2, 1.9], type: 'image' },
  { pos: [6.5, 2.8, -4.5],   rot: [0, -Math.PI / 5, -0.1],    scale: [3, 1.8],   type: 'image' },
  
  { pos: [-8, 3.5, -10],     rot: [0.2, Math.PI / 5, 0],      scale: [3.8, 2.2], type: 'video_placeholder' },
  { pos: [8.5, -2.5, -9],    rot: [-0.1, -Math.PI / 4, 0],    scale: [3.5, 2],   type: 'video_placeholder' },

  // CEILING & FLOOR
  { pos: [-1.5, 5, -3.5],    rot: [Math.PI / 4, 0.1, 0.05],   scale: [2.8, 1.6], type: 'image' },
  { pos: [2.5, 6.5, -8],     rot: [Math.PI / 5, -0.1, 0],     scale: [3.5, 2],   type: 'video_placeholder' },

  { pos: [2, -5.5, -4],      rot: [-Math.PI / 4, -0.1, 0],    scale: [3, 1.8],   type: 'image' },
  { pos: [-3.5, -6, -9],     rot: [-Math.PI / 5, 0.2, 0.05],  scale: [3.8, 2.2], type: 'video_placeholder' },

  // DEEP BACKGROUND
  { pos: [-3, -1.5, -18],    rot: [0.05, 0.2, 0],             scale: [5, 3],     type: 'image' },
  { pos: [4, 2, -20],        rot: [-0.05, -0.15, 0],          scale: [6, 3.5],   type: 'video_placeholder' }
];

/* ---------------- CINEMATIC CAMERA CONTROLLER ---------------- */
const CameraController = () => {
  const scroll = useScroll();

  useFrame((state) => {
    // 1. Spawns zoomed-in extremely tight (Z=-1)
    // 2. Instantly yanks backwards to Z=5 on load
    // 3. Scrolling pushes you deep into the tunnel to Z=-15
    const targetZ = 5 - scroll.offset * 20; 
    state.camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.06); 
  });

  return null;
};

/* ---------------- COMPONENTS ---------------- */

// THE FIX: Completely stripped out useVideoTexture so WebGL cannot crash.
// This just renders a dark grey box where your videos will eventually go.
const VideoPlaceholder = ({ data }: any) => {
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      <meshBasicMaterial color="#222222" wireframe={false} />
      <meshBasicMaterial color="#ffffff" wireframe={true} /> 
    </mesh>
  );
};

const ImagePlane = ({ data, index }: any) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 400}`, [index]);
  return (
    <Image 
      position={data.pos} rotation={data.rot} url={url} 
      scale={data.scale} transparent opacity={0.8} 
      color="#999999" toneMapped={false} 
    />
  );
};

const MediaPanel = ({ data, index }: any) => {
  return (
    <Float speed={2} rotationIntensity={0.08} floatIntensity={0.15}>
      {data.type === 'video_placeholder' 
        ? <VideoPlaceholder data={data} />
        : <ImagePlane data={data} index={index} />
      }
    </Float>
  );
};

/* ---------------- CENTRAL LOGO ---------------- */
const CentralLogo = () => (
  <group position={[0, 0, -3]}>
    <Text
      fontSize={1.1} 
      scale={[1.7, 1, 1]} 
      letterSpacing={-0.08}
      color="#ffffff"
      strokeWidth={0.04} 
      strokeColor="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text
      fontSize={0.18}
      position={[0, -0.85, 0]}
      letterSpacing={2}
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
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      
      <video
        autoPlay loop muted playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, zIndex: 0, pointerEvents: "none" }}
      >
        <source src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4" type="video/mp4" />
      </video>

      <div 
        style={{ 
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} 
      />

      <Canvas camera={{ position: [0, 0, -1], fov: FOV }} gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.25}>
            <CameraController />
            <fog attach="fog" args={["#000000", 2, 28]} />
            <ambientLight intensity={1} />
            
            <CentralLogo />
            
            {PANELS.map((panel, i) => (
              <MediaPanel key={i} data={panel} index={i} />
            ))}
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}