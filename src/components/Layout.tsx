import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide the layout UI (logo/button) if we are on the Menu page
  // because the Menu page has its own "Close" button.
  if (location.pathname === '/menu') {
    return <Outlet />;
  }

  // ... (Keep your previous Button logic here: buttonText, buttonAction, etc.) ...
  // Re-pasting logic for clarity:
  let buttonText = "MENU";
  let buttonAction = () => navigate('/menu');
  if (location.pathname.startsWith('/project/')) {
    buttonText = "BACK WORK";
    buttonAction = () => navigate('/work');
  }

  return (
    <>
      {/* 1. Global Static Noise Overlay */}
      <div className="noise-overlay" />

      {/* 2. Background Grid (optional, if you want it on non-3D pages) */}
      <div className="grid-background" />
      
      {/* 3. Main Content */}
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Outlet />
      </main>

      {/* 4. Floating Footer Button */}
      <div style={{
        position: 'fixed', bottom: '40px', left: '50%', 
        transform: 'translateX(-50%)', zIndex: 50 
      }}>
        <button 
          onClick={buttonAction}
          style={{
            background: 'white', color: 'black', border: 'none',
            padding: '12px 32px', borderRadius: '30px',
            fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          {buttonText}
        </button>
      </div>

      {/* 5. Logo */}
      <div style={{
        position: 'fixed', top: '30px', left: '50%', 
        transform: 'translateX(-50%)', zIndex: 50, mixBlendMode: 'difference'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: 'white' }}>PANORAMA</h1>
      </div>
    </>
  );
};

export default Layout;