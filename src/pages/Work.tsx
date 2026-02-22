import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Sample Data based on the HTML source you provided
const projects = [
  { id: '01', client: 'ZERO', title: 'SKATE OR DIE', img: 'https://framerusercontent.com/images/izesDIIpVhRGHCepu9trdoAcd3k.png' },
  { id: '02', client: 'FENDER', title: 'BASSMAN', img: 'https://framerusercontent.com/images/yBbkSWTAYb0ypoJGjlA2nd4nYo.png' },
  { id: '03', client: 'NIKE', title: 'JOGA BONITO 2.0', img: 'https://framerusercontent.com/images/ZyoY9VgUJdJie8Sx25XTCdFTSo.png' },
  { id: '04', client: 'REDBULL', title: 'COME RAIN OR SHINE', img: 'https://framerusercontent.com/images/5AKYYKaUteYI46sSADeXMib3U.png' },
  { id: '05', client: 'EVERLAST', title: 'UNLEASH YOUR POWER', img: 'https://framerusercontent.com/images/Jqd0S2le6Funti3d4TXTNELNvas.png' },
  { id: '06', client: 'SPOTIFY', title: 'TURN UP THE INNER VOLUME', img: 'https://framerusercontent.com/images/tQGnSHEHpZp1oU9HEMAg8VfnQ.png' },
  { id: '07', client: 'BENTLEY', title: 'THE SANDMAN', img: 'https://framerusercontent.com/images/8DmVo4XWdc66i5r7z2Pf9ct9NlA.png' },
  { id: '08', client: 'RIP CURL', title: 'SWIMMING WITH SHARKS', img: 'https://framerusercontent.com/images/hcb6oWFIslUb9NML4hXg6gCajj4.png' },
];

export default function WorkList() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse for the floating image effect
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        paddingTop: '120px', 
        paddingBottom: '100px',
        position: 'relative',
        cursor: 'default' 
      }}
    >
      
      {/* 1. HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ 
          fontFamily: '"Bebas Neue", sans-serif', 
          fontSize: '20px', 
          color: '#8F8F8F', 
          letterSpacing: '1px' 
        }}>
          WORK
        </h2>
      </div>

      {/* 2. PROJECT LIST */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {projects.map((project, index) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredProject(project.img)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Top Divider Line */}
            <div style={{ width: '100%', height: '1px', backgroundColor: '#E5E5E5' }} />

            <Link 
              to={`/project/${project.id}`} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '40px 0', 
                textDecoration: 'none',
                color: 'black'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '40px' }}>
                {/* Client Name (Big & Bold) */}
                <h3 style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  fontSize: '64px', 
                  margin: 0, 
                  lineHeight: 0.9 
                }}>
                  {project.client}
                </h3>

                {/* Project Title (Smaller & Uppercase) */}
                <span style={{ 
                  fontFamily: '"Inter", sans-serif', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  textTransform: 'uppercase',
                  color: '#000'
                }}>
                  {project.title}
                </span>
              </div>

              {/* Arrow Icon (Exact SVG from source) */}
              <div style={{ width: '44px', height: '44px' }}>
                <svg width="100%" height="100%" viewBox="0 0 44 44" fill="none">
                  <path d="M0.723 0.956H42.635M42.635 0.956V42.87M42.635 0.956L4.956 38.635" stroke="black" strokeWidth="2" />
                </svg>
              </div>
            </Link>
          </motion.div>
        ))}
        {/* Bottom Divider Line */}
        <div style={{ width: '100%', height: '1px', backgroundColor: '#E5E5E5' }} />
      </div>

      {/* 3. FLOATING HOVER IMAGE */}
      {/* In Framer, this image usually follows the cursor or appears fixed. 
         I've set it to follow the cursor for that premium feel.
      */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: mousePos.x - 200, // Centers image on cursor X
              y: mousePos.y - 150  // Centers image on cursor Y
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '400px',
              height: '300px',
              pointerEvents: 'none',
              zIndex: 50,
              overflow: 'hidden',
              borderRadius: '8px'
            }}
          >
            <img 
              src={hoveredProject} 
              alt="Project Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. BACKGROUND GRID (Subtle Pattern from source) */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: 'url("https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png")',
        backgroundSize: '256px'
      }} />

    </div>
  );
}