import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from './Footer'; 

const framerSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 1
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide default cursor globally
    document.body.style.cursor = 'none'; 

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Direct DOM manipulation for zero-lag performance
        // We use requestAnimationFrame to sync with the browser's refresh rate
        requestAnimationFrame(() => {
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
          }
        });
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      document.body.style.cursor = 'auto'; 
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "14px", 
        height: "14px",
        backgroundColor: "rgb(255, 255, 255)", 
        borderRadius: "88px", 
        pointerEvents: "none",
        zIndex: 999999, 
        mixBlendMode: "difference",
        willChange: "transform", // Optimizes GPU rendering
        transition: "transform 0.05s linear", // Optional slight smoothing without the spring lag
      }}
    />
  );
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMenuPage = location.pathname === '/menu';

  const showFooter = !isMenuPage && (['/work', '/about', '/contact'].includes(location.pathname) || 
                     location.pathname.startsWith('/project/'));

  let buttonText = "Menu";
  let buttonAction = () => navigate('/menu');
  
  if (location.pathname.startsWith('/project/')) {
    buttonText = "BACK WORK";
    buttonAction = () => navigate('/work');
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#000' }}>
      
      <CustomCursor />

      <div 
        className="noise-overlay" 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 9998, 
          pointerEvents: 'none', 
          opacity: 0.05 
        }} 
      />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {showFooter && <Footer />}

      {!isMenuPage && (
        <div style={{
          position: 'fixed', 
          bottom: '48px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 10000, 
          pointerEvents: 'none'
        }}>
          <motion.button 
            onClick={buttonAction}
            initial={{ scale: 1 }}
            whileHover={{ 
              scale: 1.15, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)' 
            }}
            whileTap={{ scale: 0.95 }}
            transition={framerSpring}
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'rgb(255, 255, 255)', 
              color: 'rgb(0, 0, 0)', 
              border: 'none',
              padding: '12px 40px', 
              borderRadius: '32px',
              cursor: 'none', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '52px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              outline: 'none',
            }}
          >
            <span style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '24px',
              fontWeight: 700, 
              textTransform: 'uppercase',
              color: '#000',
              lineHeight: '1', 
              display: 'block',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              {buttonText}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Layout;