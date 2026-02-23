import React, { Suspense, useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion, useMotionValue, useSpring } from "framer-motion";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// --- VIDEO FILES ---
const VIDEO_FILES = [
  "vid1.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.26 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.27 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM (2).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.28 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.29 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.30 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.31 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.31 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.32 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM (2).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.33 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.34 PM (1).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.34 PM (2).mp4",
  "WhatsApp Video 2026-02-21 at 3.00.34 PM.mp4",
  "WhatsApp Video 2026-02-21 at 3.00.35 PM.mp4",
];

const framerEase: [number, number, number, number] = [0.44, 0, 0.56, 1];

// --- CUSTOM CURSOR COMPONENT ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 700, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    document.body.style.cursor = 'none'; 
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => {
      document.body.style.cursor = 'auto'; 
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        width: "14px",
        height: "14px",
        backgroundColor: "#ffffff",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 99999,
        mixBlendMode: "difference",
      }}
    />
  );
};

// --- 2D BACKGROUND GRID ---
const BackgroundWireframe = ({ isDark }: { isDark: boolean }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      backgroundColor: isDark ? "#000000" : "#ffffff",
      transition: "background-color 0.1s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      pointerEvents: 'none'
    }}
  >
    <svg
      viewBox="0 0 1516 832"
      preserveAspectRatio="xMidYMid slice"
      style={{
        width: "100%",
        height: "100%",
        opacity: isDark ? 0.12 : 0,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      <g stroke="#ffffff" strokeWidth="1.5" fill="none">
        <path d="M624.25 338.251h258.5v144.5h-258.5z M586.25 314.25h333.5v192.5h-333.5z M558.25 295.25h389.5v230.5h-389.5z M505.25 261.25h495.5v298.5h-495.5v-298.5Z M427.25 210.25h652.5v400.5h-652.5v-400.5Z M283.25 116.25h940.5v588.5h-940.5v-588.5Z M106.25 11.25h1230.5v808.5H106.25V11.25ZM723.5 482.5 543.778 830.884M723.5 338.672 543.778-9.712M674 483 337 829.496m337-491.324L337-8.324m544.499 490.823 536.111 348.497M881.499 338.673 1417.61-9.824M624.833 482.498 88.72 830.995m536.113-492.321L88.72-9.823M840 482.5l338.11 346.997M840 338.672 1178.11-8.325M793.5 483l179.722 347.884M793.5 338.171 973.222-9.712M758.249 830.999l.001-348.499m-.001-492.327.001 348.499M883 409.939h749.33m-1007.999-1H-125m1008-33.438 744.33-173m-1002.999 172-744.331-173m1003 249.5 747.83 133m-1006.498-134-747.831 133" />
      </g>
    </svg>
  </div>
);

// --- THREE.JS THEME + FOG CONTROLLER ---
const ThemeController = ({ isDark }: { isDark: boolean }) => {
  const { scene } = useThree();
  const fogColor = useMemo(() => new THREE.Color("#000000"), []);

  useFrame(() => {
    const targetColor = new THREE.Color(isDark ? "#000000" : "#ffffff");
    fogColor.lerp(targetColor, 0.15);
    scene.background = null;
    if (!scene.fog) scene.fog = new THREE.Fog("#000000", 30, 100);
    scene.fog.color.copy(fogColor);
  });
  return null;
};

// --- THREE.JS CAMERA CONTROLLER ---
const CameraController = ({ scrollZ }: { scrollZ: number }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    const targetZ = scrollZ * -0.1;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
  });
  return null;
};

// --- THREE.JS TEXT CHECKPOINTS ---
const TextCheckpoints = () => {
  return (
    <group>
      <group position={[0, 0, -150]}>
        <Text
          fontSize={2.5}
          color="#ffffff"
          fontWeight={900}
          letterSpacing={0.1}
          anchorX="center"
          anchorY="middle"
        >
          FEATURED WORK
        </Text>
        <Text
          fontSize={0.3}
          position={[0, -1.8, 0]}
          color="#aaaaaa"
          letterSpacing={0.5}
          anchorX="center"
          anchorY="middle"
        >
          SCROLL DEEPER
        </Text>
      </group>

      <group position={[0, 0, -275]}>
        <Text
          fontSize={3.5}
          color="#ffffff"
          fontWeight={900}
          letterSpacing={0.1}
          anchorX="center"
          anchorY="middle"
        >
          OUR DIRECTORS
        </Text>
      </group>
    </group>
  );
};

// --- CSS VIDEO WALL ---
const AnimatedVideo = ({
  src,
  style,
  initial,
  delay = 0.8,
  duration = 1.2,
  opacity = 1,
}: any) => (
  <motion.div
    style={{ position: "absolute", backgroundColor: "#000", ...style }}
    initial={{ opacity: opacity === 1 ? 1 : 0.4, scale: 0.4, ...initial }}
    animate={{ opacity, scale: 1, x: 0, y: 0 }}
    transition={{ delay, duration, ease: framerEase }}
  >
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </motion.div>
);

const CSSVideoWalls = ({ scale, scrollZ, isDark }: { scale: number; scrollZ: number; isDark: boolean }) => {
  const getVid = (index: number) =>
    `/${VIDEO_FILES[index % VIDEO_FILES.length]}`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        overflow: "hidden",
        perspective: "1000px" 
      }}
    >
      <div
        style={{
          width: "1440px",
          height: "869px",
          position: "relative",
          transform: `scale(${scale}) translateZ(${scrollZ}px)`,
          transformStyle: "preserve-3d",
          flexShrink: 0,
          transition: "transform 0.1s ease-out" 
        }}
      >
        <div style={{ position: "absolute", inset: "-4195px -8000px -4180px -8007px", overflow: "hidden", transformStyle: "preserve-3d" }}>
          
          <div style={{ position: "absolute", left: "calc(51.78% - 1172px / 2)", top: "calc(50.07% - 366px / 2)", width: "1172px", height: "366px", transform: "perspective(500px) rotateY(-55deg) translateZ(0)", transformStyle: "preserve-3d", overflow: "hidden" }}>
            <AnimatedVideo src={getVid(0)} initial={{ x: -1000 }} duration={1.0} style={{ left: "660px", top: "31px", width: "242px", height: "134px" }} />
            <AnimatedVideo src={getVid(1)} initial={{ x: -1000 }} duration={1.2} style={{ left: "628px", top: "116px", width: "165px", height: "91px" }} />
            <AnimatedVideo src={getVid(2)} initial={{ x: -1000 }} duration={1.1} style={{ left: "396px", top: "65px", width: "124px", height: "56px" }} />
            <AnimatedVideo src={getVid(3)} initial={{ x: -1000 }} duration={1.3} style={{ left: "766px", bottom: "36px", width: "165px", height: "91px" }} />
            <AnimatedVideo src={getVid(4)} initial={{ x: -1000 }} duration={1.1} style={{ left: "calc(50.93% - 165px / 2)", bottom: "123px", width: "165px", height: "74px" }} />
          </div>

          <div style={{ position: "absolute", left: "calc(48.22% - 1172px / 2)", top: "calc(49.91% - 366px / 2)", width: "1172px", height: "366px", transform: "perspective(500px) rotateY(55deg) translateZ(0)", transformStyle: "preserve-3d", overflow: "hidden" }}>
            <AnimatedVideo src={getVid(5)} initial={{ x: 1000 }} duration={1.0} style={{ left: "623px", top: "100px", width: "165px", height: "81px" }} />
            <AnimatedVideo src={getVid(6)} initial={{ x: 1000 }} duration={1.4} style={{ left: "330px", top: "44px", width: "165px", height: "91px" }} />
            <AnimatedVideo src={getVid(7)} initial={{ x: 1000 }} duration={1.3} opacity={0.4} style={{ left: "385px", top: "calc(46.17% - 91px / 2)", width: "165px", height: "91px" }} />
            <AnimatedVideo src={getVid(8)} initial={{ x: 1000 }} duration={1.1} style={{ left: "268px", bottom: "36px", width: "165px", height: "91px" }} />
            <AnimatedVideo src={getVid(9)} initial={{ x: 1000 }} duration={1.2} style={{ left: "147px", top: "85px", width: "165px", height: "91px" }} />
          </div>

          <div style={{ position: "absolute", left: "calc(50.01% - 545px / 2)", top: "calc(51.56% - 1000px / 2)", width: "545px", height: "1000px", transform: "perspective(500px) rotateX(73deg) translateZ(0)", transformStyle: "preserve-3d", overflow: "hidden" }}>
            <AnimatedVideo src={getVid(10)} initial={{ y: -1000 }} duration={1.4} style={{ left: "73px", bottom: "162px", width: "149px", height: "76px" }} />
            <AnimatedVideo src={getVid(11)} initial={{ y: -1000 }} duration={1.0} style={{ left: "342px", bottom: "146px", width: "115px", height: "112px" }} />
            <AnimatedVideo src={getVid(12)} initial={{ y: -1000 }} duration={1.3} style={{ left: "36px", bottom: "299px", width: "163px", height: "282px" }} />
            <AnimatedVideo src={getVid(13)} initial={{ y: -1000 }} duration={1.2} style={{ left: "142px", bottom: "272px", width: "116px", height: "113px" }} />
            <AnimatedVideo src={getVid(14)} initial={{ y: -1000 }} duration={1.4} style={{ left: "300px", bottom: "357px", width: "122px", height: "170px" }} />
          </div>

          <div style={{ position: "absolute", left: "calc(50% - 545px / 2)", top: "calc(48.65% - 1000px / 2)", width: "545px", height: "1000px", transform: "perspective(500px) rotateX(-73deg) translateZ(0)", transformStyle: "preserve-3d", overflow: "hidden" }}>
            <AnimatedVideo src={getVid(15)} initial={{ y: 1000 }} duration={1.4} style={{ left: "305px", top: "calc(46.5% - 134px / 2)", width: "105px", height: "134px" }} />
            <AnimatedVideo src={getVid(16)} initial={{ y: 1000 }} duration={1.1} style={{ left: "354px", top: "178px", width: "107px", height: "58px" }} />
            <AnimatedVideo src={getVid(17)} initial={{ y: 1000 }} duration={1.2} style={{ left: "136px", top: "329px", width: "123px", height: "90px" }} />
            <AnimatedVideo src={getVid(0)} initial={{ y: 1000 }} duration={1.1} style={{ left: "263px", top: "222px", width: "132px", height: "74px" }} />
            <AnimatedVideo src={getVid(1)} initial={{ y: 1000 }} duration={1.0} style={{ left: "76px", top: "208px", width: "95px", height: "54px" }} />
          </div>
        </div>

        <div style={{ position: "absolute", left: "calc(50% - 427px / 2)", top: "calc(50% - 175px / 2)", width: "427px", height: "175px", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
          <img src="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" alt="Logo" style={{ position: 'absolute', width: '100%', height: '100%', filter: 'invert(1)', opacity: isDark ? 0 : 1, transition: 'opacity 0.1s ease' }} />
          <img src="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" alt="Logo" style={{ position: 'absolute', width: '100%', height: '100%', opacity: isDark ? 1 : 0, transition: 'opacity 0.1s ease' }} />
        </div>
      </div>
    </div>
  );
};

// --- MAIN SCENE ---
export default function TunnelScene() {
  const [isDark, setIsDark] = useState(false);
  const [scale, setScale] = useState(1);
  const [scrollZ, setScrollZ] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsDark(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1440;
      const scaleY = window.innerHeight / 869;
      setScale(Math.max(scaleX, scaleY));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      setScrollZ(prev => Math.max(0, Math.min(prev + e.deltaY * 3, 2600)));
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      <CustomCursor />
      
      <BackgroundWireframe isDark={isDark} />

      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 75 }}
      >
        <Suspense fallback={null}>
          <ThemeController isDark={isDark} />
          <CameraController scrollZ={scrollZ} />
          <TextCheckpoints />
        </Suspense>
      </Canvas>

      <CSSVideoWalls scale={scale} scrollZ={scrollZ} isDark={isDark} />

      {/* Fog Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
        background: 'radial-gradient(circle at center, transparent 20%, #000 95%)',
        opacity: isDark ? 0.9 : 0, transition: 'opacity 1s ease'
      }} />

      {/* THE LOCAL BUTTON WAS REMOVED FROM HERE TO PREVENT OVERLAPPING */}
    </div>
  );
}