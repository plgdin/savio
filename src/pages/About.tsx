import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const framerEase = [0.44, 0, 0.56, 1];

// 1. DIRECTIONAL TICKER
const Ticker = ({ direction = 1 }: { direction?: number }) => (
  <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', padding: '5px 0' }}>
    <motion.div
      initial={{ x: direction > 0 ? "0%" : "-50%" }}
      animate={{ x: direction > 0 ? "-50%" : "0%" }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ display: 'flex', width: 'fit-content' }}
    >
      {[...Array(6)].map((_, i) => (
        <h1 key={i} style={{ 
          fontFamily: '"Panchang", sans-serif', 
          fontSize: '88px', 
          fontWeight: 700, 
          color: '#fff', 
          margin: 0, 
          paddingRight: '60px',
          letterSpacing: '1px',
          lineHeight: '1.1'
        }}>
          AN UNUSUAL <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>PERSPECTIVE</span>
        </h1>
      ))}
    </motion.div>
  </div>
);

// 2. SCROLL REVEAL HIGHLIGHT COMPONENT
const ScrollHighlight = ({ text }: { text: string }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.2"] 
  });

  const words = text.split(" ");
  
  return (
    <p ref={containerRef} style={{ 
      fontFamily: '"Panchang", sans-serif', 
      fontSize: '24px', 
      fontWeight: 500, 
      lineHeight: '1.4', 
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.1)', 
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
        
        return (
          <motion.span key={i} style={{ opacity, color: '#fff', marginRight: '8px', display: 'inline-block' }}>
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

export default function About() {
  const photoRef = useRef(null);
  const { scrollYProgress: photoProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "center center"] 
  });

  const photoScale = useTransform(photoProgress, [0, 1], [0.7, 1]);
  const photoOpacity = useTransform(photoProgress, [0, 0.4], [0, 1]);

  return (
    <div style={{ 
      position: 'relative', width: '100%', minHeight: '100vh', 
      backgroundColor: '#000', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', paddingTop: '32px', paddingBottom: '80px', // Adjusted for global footer flow
      overflowX: 'hidden', color: '#fff'
    }}>
      
      {/* BACKGROUND VERTICAL GRID LINES */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ width: '100%', maxWidth: '1440px', display: 'flex', justifyContent: 'space-between', padding: '0 80px', boxSizing: 'border-box' }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ width: '1px', height: '100%', backgroundColor: '#121212' }} />
          ))}
        </div>
      </div>

      {/* LOGO */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' }}>
        <img src="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" alt="Panorama" style={{ width: '142px', filter: 'brightness(0) invert(1)', marginBottom: '40px' }} />
        <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', color: '#8F8F8F', margin: 0 }}>ABOUT US</p>
      </div>

      {/* TOP PHOTOS */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1440px', padding: '0 80px', boxSizing: 'border-box', marginBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {["OdJ6rMGXMGD9QZYeL6UM5VVy99s.png", "VHUP2RJpmokhCk89942ktV2MUg.png", "WboZDKLKfAbmcKVbmD3lchD0IbA.png", "EW7tnEdWsn1NzgMyugt9qKLJlY.png"].map((img, idx) => (
            <div key={idx} style={gridBoxStyle}>
              <img src={`https://framerusercontent.com/images/${img}`} style={imgStyle} alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* TICKERS */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '160px' }}>
        <Ticker direction={1} />
        <Ticker direction={-1} />
      </div>

      {/* MIDDLE TEXT */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1440px', padding: '0 80px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
        <ScrollHighlight text="OUR ESSENCE IS SHAPED BY AN UNUSUAL PERSPECTIVE, WHERE EACH PROJECT IS A CHALLENGE TO MOVE US BEYOND OUR COMFORT ZONE ALONGSIDE OUR CLIENTS. PANORAMA FILMS IS A FILM PRODUCTION COMPANY LOCATED IN AMSTERDAM THAT SERVES CLIENTS FROM ALL OVER THE WORLD. FOUNDED BY REBBECA KLAUS AND JOHN MCFLY." />
      </div>

      {/* LAST PHOTO: SMALLER AND CENTERED */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '1440px', 
        padding: '0 80px', 
        boxSizing: 'border-box', 
        marginTop: '160px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <motion.div 
          ref={photoRef}
          style={{ 
            scale: photoScale,
            opacity: photoOpacity,
            width: '640px', 
            height: '371px', 
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
          transition={{ duration: 0.8, ease: framerEase }}
        >
          <img 
            src="https://framerusercontent.com/images/OjXQm6Jaj9oDCmxZpUYfpLPPtk8.png" 
            alt="Founders" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </motion.div>
      </div>

      {/* LOCAL FOOTER BAR REMOVED - Handled by global Layout */}
    </div>
  );
}

const gridBoxStyle: React.CSSProperties = {
  width: '160px',
  height: '88px',
  overflow: 'hidden'
};

const imgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};