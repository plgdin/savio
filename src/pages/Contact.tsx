import React from 'react';
import { motion } from 'framer-motion';

const framerEase = [0.44, 0, 0.56, 1];

export default function Contact() {
  return (
    <div style={{ 
      position: 'relative',
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: '32px', 
      paddingBottom: '80px', // Adjusted to flow into global footer
      overflowX: 'hidden',
      color: '#fff'
    }}>
      
      {/* 1. BACKGROUND VERTICAL GRID LINES */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ width: '100%', maxWidth: '1440px', display: 'flex', justifyContent: 'space-between', padding: '0 80px', boxSizing: 'border-box' }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ width: '1px', height: '100%', backgroundColor: '#121212' }} />
          ))}
        </div>
      </div>

      {/* 2. LOGO SECTION */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: '80px' }}>
        <img 
          src="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
          alt="Panorama Films" 
          style={{ width: '142px', filter: 'brightness(0) invert(1)' }} 
        />
      </div>

      {/* 3. MAIN CONTENT: Locked to 50% width centered */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: framerEase }}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          width: '100%', 
          maxWidth: '1440px', 
          padding: '0 80px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {/* Label */}
          <p style={{ 
            fontFamily: '"Bebas Neue", sans-serif', 
            fontSize: '20px', 
            color: '#8F8F8F', 
            textAlign: 'center',
            margin: 0 
          }}>
            Contact
          </p>

          {/* Big Email Title */}
          <h1 style={{ 
            fontFamily: '"Panchang", sans-serif', 
            fontSize: '28px', 
            fontWeight: 600, 
            textAlign: 'center',
            margin: 0,
            letterSpacing: '1px'
          }}>
            HELLO@PANORAMA.COM
          </h1>

          {/* Formspark-style Form */}
          <form style={{ display: 'grid', gridTemplateRows: 'max-content 1fr max-content', gap: '8px', height: '337px' }}>
            <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '8px' }}>
              <input type="text" placeholder="NAME" style={inputStyle} />
              <input type="email" placeholder="EMAIL" style={inputStyle} />
            </div>
            <textarea placeholder="MESSAGE" style={{ ...inputStyle, resize: 'vertical', minHeight: '150px' }} />
            <div>
              <input 
                type="submit" 
                value="SUBMIT" 
                style={{
                  width: '100%',
                  padding: '16px',
                  fontFamily: '"Panchang", sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  backgroundColor: 'rgb(54, 54, 54)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 1
                }} 
              />
            </div>
          </form>
        </div>
      </motion.div>

      {/* SECTION 4 REMOVED: Handled by Layout.tsx/Footer.tsx */}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  backgroundColor: 'rgb(204, 204, 204)',
  color: '#000',
  fontFamily: '"Panchang", sans-serif',
  fontSize: '14px',
  border: 'none',
  outline: 'none',
  boxSizing: 'border-box'
};