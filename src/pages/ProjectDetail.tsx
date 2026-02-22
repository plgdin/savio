import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hardcoded data matching the "ZERO - SKATE OR DIE" Framer page
const projectData = {
  id: '01',
  client: 'ZERO',
  title: 'SKATE OR DIE',
  year: '2024',
  heroVideo: 'https://framerusercontent.com/assets/eQTHTGtHpNFQn45NCUi3YrcBbs.mp4',
  quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."',
  gridImg1: '/izesDIIpVhRGHCepu9trdoAcd3k.png', 
  gridImg2: '/nHbeBRK7mwYEJKWQhuO3N4euVE.png', 
  description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity. our commitment to authenticity guarantees a compelling narrative that elevates zero's presence in the skateboarding world.",
  gridImg3: 'https://framerusercontent.com/images/zeKdJDWjwSiD0sOIBPDAIv9CY.png',
  stats: [
    { number: '800K', label: 'INTERACTIONS' },
    { number: '90,3K', label: 'new followers' }
  ],
  team: [
    { name: 'ANDRÉ LACERDA', role: 'DESIGN' },
    { name: 'Hanri Lamarca', role: 'PHOTOGRAPHY' },
    { name: 'ERIKKA KLAUS', role: 'director' },
    { name: 'Christian Zanini', role: 'Post-production' }
  ]
};

const framerEase = [0.44, 0, 0.56, 1];

export default function ProjectDetail() {
  const { id } = useParams();

  // Scroll to top when loading the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div style={{ 
      position: 'relative',
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: 'transparent',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: '40px', 
      paddingBottom: '150px',
      overflowX: 'hidden',
      color: '#fff'
    }}>
      
      {/* 1. BACKGROUND VERTICAL GRID LINES (Spans 1440px to match Framer) */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ width: '100%', maxWidth: '1440px', display: 'flex', justifyContent: 'space-between', padding: '0 80px', boxSizing: 'border-box' }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ width: '1px', height: '100%', backgroundColor: '#121212' }} />
          ))}
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1440px', padding: '0 80px', boxSizing: 'border-box' }}>
        
        {/* 2. TOP HERO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: framerEase }}
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
          {/* Breadcrumb */}
          <div>
            <Link to="/work" style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: '#8F8F8F', textDecoration: 'none', letterSpacing: '1px' }}>
              ← back work
            </Link>
          </div>

          {/* Title Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <h2 style={{ fontFamily: '"Panchang", sans-serif', fontSize: '56px', fontWeight: 300, margin: 0 }}>
                {projectData.client}
              </h2>
              <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '56px', fontWeight: 400, margin: 0, letterSpacing: '1px' }}>
                {projectData.title}
              </h1>
            </div>
            <h5 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '32px', fontWeight: 400, margin: 0 }}>
              {projectData.year}
            </h5>
          </div>
        </motion.div>

        {/* 3. HERO VIDEO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: framerEase }}
          style={{ width: '100%', height: '80vh', overflow: 'hidden', marginTop: '50px' }}
        >
          <video src={projectData.heroVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </motion.div>

        {/* 4. QUOTES SECTION (50% Offset) */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '100px' }}>
          <div style={{ width: '50%' }} /> {/* Empty Left Column */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: '"Panchang", sans-serif', fontSize: '28px', fontWeight: 300, lineHeight: '1.4', margin: 0 }}>
              {projectData.quote}
            </p>
          </div>
        </div>

        {/* 5. MIDDLE GRIDS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '162px', marginTop: '162px' }}>
          
          {/* Grid-01: Two Columns (Full Left Image, Half Right Image) */}
          <div style={{ display: 'flex', gap: '32px', height: '400px' }}>
            {/* Column 1: Big Image */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img src={projectData.gridImg1} alt="Grid 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Column 2: Small Image + Empty Space */}
            <div style={{ flex: 1, display: 'flex' }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <img src={projectData.gridImg2} alt="Grid 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ width: '50%' }} /> {/* Forces image to stay on the left half */}
            </div>
          </div>

          {/* Grid-02: Text (Left) + Landscape Image (Right) */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <p style={{ fontFamily: '"Panchang", sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.6', margin: 0, paddingRight: '16px' }}>
                {projectData.description}
              </p>
            </div>
            <div style={{ flex: 1, height: '400px', overflow: 'hidden' }}>
              <img src={projectData.gridImg3} alt="Grid 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* 6. BOTTOM ANALYTICS (Split 50/50) */}
        <div style={{ display: 'flex', marginTop: '120px' }}>
          {/* Metric 1 */}
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: '"Panchang", sans-serif', fontSize: '56px', fontWeight: 700, margin: 0, lineHeight: '1' }}>{projectData.stats[0].number}</span>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: '#8F8F8F', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{projectData.stats[0].label}</span>
          </div>
          {/* Metric 2 */}
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px', boxSizing: 'border-box' }}>
            <span style={{ fontFamily: '"Panchang", sans-serif', fontSize: '56px', fontWeight: 700, margin: 0, lineHeight: '1' }}>{projectData.stats[1].number}</span>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: '#8F8F8F', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{projectData.stats[1].label}</span>
          </div>
        </div>

        {/* 7. TEAM / ACCORDIONS (50% Offset) */}
        <div style={{ display: 'flex', marginTop: '120px' }}>
          <div style={{ width: '50%' }} /> {/* Empty Left Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '16px', boxSizing: 'border-box' }}>
            {projectData.team.map((member, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '78px', justifyContent: 'flex-start' }}>
                <div style={{ width: '100%', height: '1px', backgroundColor: 'rgb(150, 150, 150)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', margin: 0, letterSpacing: '1px' }}>{member.name}</span>
                  <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}