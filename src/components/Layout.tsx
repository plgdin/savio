import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from './Footer'; 

const framerSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 1
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If on menu page, only render the Menu (prevents double buttons/noise layering)
  if (location.pathname === '/menu') {
    return <Outlet />;
  }

  // Footer visibility check
  const showFooter = ['/work', '/about', '/contact'].includes(location.pathname) || 
                     location.pathname.startsWith('/project/');

  let buttonText = "Menu";
  let buttonAction = () => navigate('/menu');
  
  if (location.pathname.startsWith('/project/')) {
    buttonText = "BACK WORK";
    buttonAction = () => navigate('/work');
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#000' }}>
      
      {/* 1. Global Static Noise Overlay */}
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

      {/* 2. Main Page Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* 3. Dynamic Footer */}
      {showFooter && <Footer />}

      {/* 4. FIXED MENU BUTTON (Bouncy Popup) */}
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
            cursor: 'pointer',
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
    </div>
  );
};

export default Layout;