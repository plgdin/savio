import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Array re-ordered to perfectly match your screenshot
const projects = [
  { id: '01', client: 'ZERO', title: 'SKATE OR DIE', img: '/izesDIIpVhRGHCepu9trdoAcd3k.png' },
  { id: '02', client: 'FENDER', title: 'BASSMAN', img: '/yBbkSWTAYb0ypoJGjlA2nd4nYo.png' }, 
  { id: '04', client: 'REDBULL', title: 'COME RAIN OR SHINE', img: '/5AKYYKaUteYI46sSADeXMib3U.png' },
  { id: '05', client: 'EVERLAST', title: 'UNLEASH YOUR POWER', img: '/Jqd0S2le6Funti3d4TXTNELNvas.png' },
  { id: '03', client: 'NIKE', title: 'JOGA BONITO 2.0', img: '/ZyoY9VgUJdJie8Sx25XTCdFTSo.png' }, 
  { id: '06', client: 'SPOTIFY', title: 'TURN UP THE INNER VOLUME', img: '/tQGnSHEHpZp1oU9HEMAg8VfnQ.png' },
  { id: '07', client: 'BENTLEY', title: 'THE SANDMAN', img: '/8DmVo4XWdc66i5r7z2Pf9ct9NlA.png' },
  { id: '08', client: 'RIP CURL', title: 'SWIMMING WITH SHARKS', img: '/hcb6oWFIslUb9NML4hXg6gCajj4.png' },
];

const framerEase = [0.44, 0, 0.56, 1];

const ProjectRow = ({ project }: { project: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={`/project/${project.id}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'block', 
        textDecoration: 'none', 
        position: 'relative', 
        width: '100%',
        overflow: 'visible' // Allows image to break out
      }}
    >
      {/* Top Divider Line (Aligned to the 1022px grid) */}
      <div style={{ width: '100%', height: '1px', backgroundColor: '#333' }} />

      {/* Row Content - Animates to White on Hover */}
      <motion.div 
        animate={{ 
          backgroundColor: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '110px', // Exact height
          padding: '0 24px', 
          position: 'relative' 
        }}
      >
        
        {/* Texts Container (Exact gap of 14px between Client and Title) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 5 }}>
          
          {/* CLIENT NAME: Slides UP on hover */}
          <div style={{ height: '38px', overflow: 'hidden', position: 'relative' }}>
            <motion.div 
              animate={{ y: isHovered ? '-50%' : '0%' }} 
              transition={{ duration: 0.4, ease: framerEase }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Normal State (White) */}
              <span style={{ fontFamily: '"Panchang", sans-serif', fontSize: '32px', fontWeight: 300, color: '#fff', height: '38px', display: 'flex', alignItems: 'center' }}>
                {project.client}
              </span>
              {/* Hover State (Black) */}
              <span style={{ fontFamily: '"Panchang", sans-serif', fontSize: '32px', fontWeight: 300, color: '#000', height: '38px', display: 'flex', alignItems: 'center' }}>
                {project.client}
              </span>
            </motion.div>
          </div>

          {/* PROJECT TITLE: Slides DOWN on hover */}
          {/* Removed letterSpacing to make the words tight and perfectly aligned like Framer */}
          <div style={{ height: '38px', overflow: 'hidden', position: 'relative' }}>
            <motion.div 
              initial={{ y: '-50%' }} // Start offset so it can slide down into the 0% position
              animate={{ y: isHovered ? '0%' : '-50%' }} 
              transition={{ duration: 0.4, ease: framerEase, delay: 0.02 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
               {/* Hover State (Black) - Needs to be on top for downward slide */}
              <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '32px', fontWeight: 400, color: '#000', height: '38px', display: 'flex', alignItems: 'center' }}>
                {project.title}
              </span>
              {/* Normal State (White) - Sits at the bottom initially */}
              <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '32px', fontWeight: 400, color: '#fff', height: '38px', display: 'flex', alignItems: 'center' }}>
                {project.title}
              </span>
            </motion.div>
          </div>

        </div>

        {/* Right Arrow Icon - Slotted perfectly to the right */}
        <div style={{ width: '44px', height: '44px', flexShrink: 0, zIndex: 5, overflow: 'hidden' }}>
             <motion.div
              animate={{ y: isHovered ? '-50%' : '0%' }}
              transition={{ duration: 0.4, ease: framerEase }}
              style={{ display: 'flex', flexDirection: 'column', height: '88px' }}
          >
              {/* Normal State (Grey) */}
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
                <path d="M0.723 0.956H42.635M42.635 0.956V42.87M42.635 0.956L4.956 38.635" stroke="#9A9A9A" strokeLinecap="square"/>
              </svg>
              {/* Hover State (Black) */}
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
                <path d="M0.723 0.956H42.635M42.635 0.956V42.87M42.635 0.956L4.956 38.635" stroke="#000000" strokeLinecap="square"/>
              </svg>
          </motion.div>
        </div>

        {/* Pop-up Image Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: framerEase }}
              style={{
                position: 'absolute', 
                right: '120px', 
                top: '50%', 
                marginTop: '-110px', 
                width: '380px', 
                height: '220px',
                pointerEvents: 'none', 
                zIndex: 20, // High z-index to pop over everything
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              <img src={project.img} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </Link>
  );
};

export default function WorkList() {
  return (
    <div style={{ 
      position: 'relative',
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: 'transparent', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: '60px', 
      paddingBottom: '150px',
      overflowX: 'hidden'
    }}>
      
      {/* 1. BACKGROUND VERTICAL GRID LINES (Constrained to 1022px to align with the list boundaries) */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
        {/* The width here MUST match the maxWidth of the list below (1022px) */}
        <div style={{ width: '100%', maxWidth: '1022px', display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          {/* Framer uses exactly 9 vertical lines */}
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ width: '1px', height: '100%', backgroundColor: '#121212' }} />
          ))}
        </div>
      </div>

      {/* 2. TOP SECTION: LOGO & "WORK" TEXT */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' }}>
        <img 
          src="https://framerusercontent.com/images/yltEkL6pigoc9lHJn4DWokbQfQ.svg" 
          alt="Panorama Films" 
          style={{ width: '142px', filter: 'brightness(0) invert(1)' }} 
        />
        <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', color: '#8F8F8F', margin: '40px 0 0 0' }}>
          WORK
        </p>
      </div>

      {/* 3. MAIN PROJECTS LIST - Locked to 1022px to perfectly intersect the grid */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1022px' }}>
        
        <motion.div initial={{ opacity: 0.001 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6, ease: framerEase }}>
          
          {projects.map((project) => <ProjectRow key={project.id} project={project} />)}
          
          {/* Final Bottom Divider */}
          <div style={{ width: '100%', height: '1px', backgroundColor: '#333' }} />
          
        </motion.div>
      </div>
      
    </div>
  );
}