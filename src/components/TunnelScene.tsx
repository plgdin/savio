import React, { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Image, useVideoTexture, ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";

const FOV = 65; 

/* ---------------- THE BREATHING COLLAGE LAYOUT ---------------- */
const PANELS = [
  // CLOSE RING
  { pos: [-5, 1.5, -1],   rot: [0, Math.PI / 5, 0],  scale: [2.5, 1.5], type: 'video' },
  { pos: [5, -1.5, -1],   rot: [0, -Math.PI / 5, 0], scale: [2.5, 1.5], type: 'video' },
  
  // MID RING
  { pos: [-7, -2.5, -5],  rot: [0, Math.PI / 5, 0],  scale: [3, 1.8],   type: 'image' },
  { pos: [-8, 3, -9],     rot: [0, Math.PI / 5, 0],  scale: [3.5, 2],   type: 'image' },
  { pos: [-9, -1, -14],   rot: [0, Math.PI / 6, 0],  scale: [4, 2.5],   type: 'video' },

  { pos: [7, 2.5, -5],    rot: [0, -Math.PI / 5, 0], scale: [3, 1.8],   type: 'image' },
  { pos: [8, -3, -9],     rot: [0, -Math.PI / 5, 0], scale: [3.5, 2],   type: 'video' },
  { pos: [9, 1, -14],     rot: [0, -Math.PI / 6, 0], scale: [4, 2.5],   type: 'image' },

  // TOP & BOTTOM WALLS
  { pos: [-2.5, 4.5, -3], rot: [Math.PI / 5, 0, 0],  scale: [2.8, 1.6], type: 'image' },
  { pos: [3, 6, -8],      rot: [Math.PI / 5, 0, 0],  scale: [3.5, 2],   type: 'video' },

  { pos: [2.5, -4.5, -3], rot: [-Math.PI / 5, 0, 0], scale: [2.8, 1.6], type: 'image' },
  { pos: [-3, -6, -8],    rot: [-Math.PI / 5, 0, 0], scale: [3.5, 2],   type: 'video' },

  // DEEP BACKGROUND
  { pos: [-2, -1, -20],   rot: [0, 0.1, 0],          scale: [5, 3],     type: 'image' },
  { pos: [3, 2, -22],     rot: [0, -0.1, 0],         scale: [5.5, 3.2], type: 'video' }
];

const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

/* ---------------- CAMERA CONTROLLER ---------------- */
const CameraController = () => {
  const scroll = useScroll();

  useFrame((state) => {
    // Flies the camera from Z=4 down into the tunnel to Z=-15 based on scroll
    const targetZ = 4 - scroll.offset * 19; 
    state.camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.08);
  });

  return null;
};

/* ---------------- COMPONENTS ---------------- */
const VideoPlane = ({ data, url }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      <meshBasicMaterial map={texture} toneMapped={false} color="#999999" />
    </mesh>
  );
};

const ImagePlane = ({ data, index }: any) => {
  const url = useMemo(() => `https://picsum.photos/800/500?random=${index + 200}`, [index]);
  return (
    <Image 
      position={data.pos} rotation={data.rot} url={url} 
      scale={data.scale} transparent opacity={0.9} 
      color="#999999" toneMapped={false} 
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

/* ---------------- CENTRAL LOGO ---------------- */
const CentralLogo = () => (
  <group position={[0, 0, -3]}>
    <Text
      // THE FONT URL IS GONE AGAIN. 
      fontSize={1.1} 
      scale={[1.7, 1, 1]} 
      letterSpacing={-0.08}
      color="#ffffff"
      strokeWidth={0.04} // Put the stroke back to fake the heavy font
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

      <Canvas camera={{ position: [0, 0, 4], fov: FOV }} gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
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