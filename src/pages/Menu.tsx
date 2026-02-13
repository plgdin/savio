import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItems = [
  { label: 'WORK', path: '/work' },
  { label: 'CONTACT', path: '/contact' },
  { label: 'ABOUT', path: '/about' },
  { label: 'HOME', path: '/' },
];

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#ffffff', // Explicit White
      color: '#000000',
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative',
      zIndex: 200 // Ensure it sits on top
    }}>
      
      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {menuItems.map((item, i) => (
          <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
            {/* The Flip Container */}
            <motion.div
              initial="initial"
              whileHover="hover"
              style={{ 
                perspective: '1000px', // Crucial for 3D flip
                cursor: 'pointer',
                height: '80px', // Reserve space
                overflow: 'visible'
              }}
            >
              <motion.div
                variants={{
                  initial: { rotateX: 0 },
                  hover: { rotateX: 360 }
                }}
                transition={{ duration: 0.6, ease: "backOut" }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* The Text */}
                <h1 style={{
                  fontSize: '4rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1,
                  fontFamily: 'Inter, sans-serif',
                  color: item.label === 'HOME' ? '#e0e0e0' : 'black', // Home is light grey
                }}>
                  {item.label}
                </h1>
                
                {/* Trick: We can duplicate the text to ensure it looks solid 
                   while flipping, or just flip the single element.
                   The hover color change is handled by CSS below or inline style logic.
                */}
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* CLOSE Button (Bottom Center) */}
      <div style={{ position: 'absolute', bottom: '50px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'black',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          CLOSE
        </button>
      </div>

      {/* Top Right Icons (Mockup) */}
      <div style={{ position: 'absolute', top: '30px', right: '30px', display: 'flex', gap: '5px' }}>
         <div style={{ width: 30, height: 30, background: '#889', borderRadius: 4 }}></div>
         <div style={{ width: 30, height: 30, background: '#889', borderRadius: 4 }}></div>
         <div style={{ width: 30, height: 30, background: '#889', borderRadius: 4 }}></div>
      </div>
    </div>
  );
}