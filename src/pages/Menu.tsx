import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItems = [
  { label: 'WORK', path: '/work' },
  { label: 'CONTACT', path: '/contact' },
  { label: 'ABOUT', path: '/about' },
  { label: 'HOME', path: '/' },
];

const framerEase = [0.44, 0, 0.56, 1];

const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
  const location = useLocation();
  
  // Improved logic to ensure path matching is exact
  const isActive = location.pathname === item.path || 
                   (location.pathname === "" && item.path === "/");

  return (
    <Link 
      to={item.path} 
      style={{ textDecoration: 'none', display: 'block', padding: '10px 0' }}
    >
      <motion.div
        initial="initial"
        // Force the rotated variant if the page is active
        animate={isActive ? "hover" : "initial"}
        whileHover="hover"
        style={{
          position: 'relative',
          height: '88px', 
          cursor: 'pointer',
          perspective: '1200px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          variants={{
            initial: { rotateX: 0, skewX: 0, opacity: 1 },
            hover: { 
              rotateX: -90, 
              skewX: 32,
              transition: { duration: 0.6, ease: framerEase }
            },
          }}
          style={{
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {/* FRONT FACE (Default State) */}
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'translateZ(44px)', 
            }}
          >
            <h1
              style={{
                fontFamily: '"Panchang", sans-serif',
                fontSize: '88px',
                fontWeight: 700,
                margin: 0,
                lineHeight: '0.8em',
                color: '#000000', 
              }}
            >
              {item.label}
            </h1>
          </motion.div>

          {/* TOP FACE (Active/Hover State) */}
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'rotateX(90deg) translateZ(44px)', 
            }}
          >
            <h1
              style={{
                fontFamily: '"Panchang", sans-serif',
                fontSize: '88px',
                fontWeight: 700,
                margin: 0,
                lineHeight: '0.8em',
                color: 'rgb(209, 209, 209)', // Specific gray from source
              }}
            >
              {item.label}
            </h1>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 20000, // Ensure it's above Layout logic
      }}
    >
      <div style={{ position: 'absolute', top: '40px', right: '40px', display: 'flex', gap: '15px', zIndex: 10 }}>
        <div style={iconStyle}>𝕏</div>
        <div style={iconStyle}>IG</div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0px' }}>
        {menuItems.map((item) => (
          <MenuItem key={item.label} item={item} />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '56px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'black',
            color: 'white',
            border: 'none',
            padding: '12px 48px',
            borderRadius: '40px',
            fontSize: '24px',
            fontFamily: '"Bebas Neue", sans-serif',
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '1px'
          }}
        >
          CLOSE
        </button>
      </div>
      
      <div className="framer-grid" style={{ opacity: 0.05, zIndex: 0 }} />
    </div>
  );
}

const iconStyle: React.CSSProperties = {
  width: '40px', 
  height: '40px', 
  border: '1px solid #ddd', 
  borderRadius: '50%', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  cursor: 'pointer', 
  fontFamily: 'Inter', 
  fontSize: '14px'
};