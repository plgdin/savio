import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, useVideoTexture } from "@react-three/drei";

/* ---------------- CAMERA ---------------- */
const FOV = 40;

/* ---------------- DEEP TUNNEL LAYOUT ---------------- */
const PANELS = [
  // LEFT WALL
  { pos: [-10, 3, -5], rot: [0, Math.PI / 3.2, 0], scale: [4, 2.5] },
  { pos: [-12, -1, -12], rot: [0, Math.PI / 4, 0], scale: [5, 3] },
  { pos: [-14, 5, -20], rot: [0, Math.PI / 5, 0], scale: [6, 3.5] },

  // RIGHT WALL
  { pos: [10, 3, -5], rot: [0, -Math.PI / 3.2, 0], scale: [4, 2.5] },
  { pos: [12, -1, -12], rot: [0, -Math.PI / 4, 0], scale: [5, 3] },
  { pos: [14, 5, -20], rot: [0, -Math.PI / 5, 0], scale: [6, 3.5] },

  // TOP
  { pos: [-4, 8, -10], rot: [Math.PI / 3, 0, 0], scale: [5, 3] },
  { pos: [5, 10, -18], rot: [Math.PI / 4, 0, 0], scale: [6, 3.5] },

  // BOTTOM
  { pos: [4, -8, -10], rot: [-Math.PI / 3, 0, 0], scale: [5, 3] },
  { pos: [-5, -10, -18], rot: [-Math.PI / 4, 0, 0], scale: [6, 3.5] },

  // CENTER DEPTH PANELS
  { pos: [0, -3, -6], rot: [0, 0, 0], scale: [5, 3] },
  { pos: [0, 3, -15], rot: [0, 0, 0], scale: [6, 3.5] },
];

/* ---------------- VIDEO SOURCES ---------------- */
const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

/* ---------------- VIDEO PANEL ---------------- */
const VideoPlane = ({ data, url }: any) => {
  const texture = useVideoTexture(url, { crossOrigin: "Anonymous" });

  return (
    <mesh
      position={data.pos}
      rotation={data.rot}
    >
      <planeGeometry args={data.scale} />
      <meshBasicMaterial map={texture} toneMapped={false} color="#999" />
    </mesh>
  );
};

const TunnelVideo = ({ data, index }: any) => {
  const url = VIDEOS[index % VIDEOS.length];

  return (
    <Suspense
      fallback={
        <mesh position={data.pos} rotation={data.rot}>
          <planeGeometry args={data.scale} />
          <meshBasicMaterial color="#111" />
        </mesh>
      }
    >
      <VideoPlane data={data} url={url} />
    </Suspense>
  );
};

/* ---------------- CENTRAL LOGO ---------------- */
const CentralLogo = () => (
  <group position={[0, 0, -6]}>
    <Text
      fontSize={0.8} // DRASTICALLY REDUCED: Was 2.4, now mathematically sized to fit
      scale={[1.5, 1, 1]} // Reduced the X-axis stretch so it doesn't bleed off screen
      letterSpacing={-0.05}
      color="#ffffff"
      strokeWidth={0.015} // Thinned out the stroke to match the smaller text size
      strokeColor="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      PANORAMA
    </Text>

    <Text
      fontSize={0.15}
      position={[0, -0.6, 0]} // Pulled up to sit tightly under the main text
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
          <fog attach="fog" args={["#000000", 8, 35]} />
          <ambientLight intensity={1} />

          <CentralLogo />

          {PANELS.map((panel, i) => (
            <TunnelVideo key={i} data={panel} index={i} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}