import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Float, Image, useVideoTexture } from "@react-three/drei";

/* ---------------- CAMERA ---------------- */
const FOV = 40;

/* ---------------- THE FRAMER COLLAGE LAYOUT ---------------- */
// Scatted exactly like the reference screenshot, not a boring rigid box.
const PANELS = [
  // LEFT SIDE
  { pos: [-4.5, -1.5, -2], rot: [0, 0.25, 0], scale: [3, 1.8], type: 'video' }, // Drifting car area (Close)
  { pos: [-5.5, 1.5, -5], rot: [0, 0.35, 0], scale: [3.5, 2], type: 'video' }, // ATV area (Mid)
  { pos: [-2.5, 0.5, -3], rot: [0, 0.1, 0], scale: [2, 1.2], type: 'image' }, // Eye / Green guy area
  { pos: [-3.5, 3.5, -6], rot: [0.1, 0.2, 0], scale: [2.5, 1.5], type: 'image' }, // Soccer top left

  // RIGHT SIDE
  { pos: [4.5, -1.5, -1], rot: [0, -0.25, 0], scale: [3, 1.8], type: 'video' }, // Boxer area (Close)
  { pos: [5.5, 1.5, -5], rot: [0, -0.35, 0], scale: [3.5, 2], type: 'video' }, // Dirt bike area (Mid)
  { pos: [2.5, -0.2, -3], rot: [0, -0.1, 0], scale: [2, 1.2], type: 'image' }, // Bikes area
  { pos: [3.5, 3.5, -6], rot: [0.1, -0.2, 0], scale: [2.5, 1.5], type: 'image' }, // DJ hands top right

  // CENTER DEPTH (Top/Bottom)
  { pos: [-0.5, -3.5, -4], rot: [-0.2, 0, 0], scale: [3, 1.8], type: 'image' }, // Shoe/Face area
  { pos: [1.5, -4.5, -7], rot: [-0.15, 0, 0], scale: [3.5, 2], type: 'video' }, // Desert runner area
  { pos: [0.5, 3.5, -8], rot: [0.15, 0, 0], scale: [3, 1.8], type: 'image' }, // Singer area (Deep)
];

/* ---------------- MEDIA SOURCES ---------------- */
const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

/* ---------------- MEDIA PANEL COMPONENTS ---------------- */
const VideoPlane = ({ data, url }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });
  return (
    <mesh position={data.pos} rotation={data.rot}>
      <planeGeometry args={data.scale} />
      <meshBasicMaterial map={texture} toneMapped={false} color="#999" />
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
      color="#999"
      toneMapped={false}
    />
  );
};

const MediaPanel = ({ data, index }: any) => {
  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <Suspense
        fallback={
          <mesh position={data.pos} rotation={data.rot}>
            <planeGeometry args={data.scale} />
            <meshBasicMaterial color="#111" />
          </mesh>
        }
      >
        {data.type === 'video'
          ? <VideoPlane data={data} url={VIDEOS[index % VIDEOS.length]} />
          : <ImagePlane data={data} index={index} />
        }
      </Suspense>
    </Float>
  );
};

/* ---------------- CENTRAL LOGO ---------------- */
const CentralLogo = () => (
  <group position={[0, 0, -6]}>
    <Text
      fontSize={0.8}
      scale={[1.5, 1, 1]}
      letterSpacing={-0.05}
      color="#ffffff"
      strokeWidth={0.015}
      strokeColor="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>
    <Text
      fontSize={0.15}
      position={[0, -0.6, 0]}
      letterSpacing={1.6}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      FILMS
    </Text>
  </group>
);

/* ---------------- MAIN COMPONENT ---------------- */
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
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.25,
          zIndex: 0,
        }}
      >
        <source
          src="https://framerusercontent.com/assets/b318xptt3gA2YnoeksZKkHw7hiG.mp4"
          type="video/mp4"
        />
      </video>

      {/* Grid Overlay */}
      <div className="framer-grid" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: FOV }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#000000", 6, 25]} />
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