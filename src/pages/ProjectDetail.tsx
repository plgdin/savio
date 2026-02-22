import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Combined Data Store for all projects
const projectsData: Record<string, any> = {
  "01": {
    client: 'ZERO',
    title: 'SKATE OR DIE',
    year: '2024',
    heroVideo: 'https://framerusercontent.com/assets/eQTHTGtHpNFQn45NCUi3YrcBbs.mp4',
    quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."',
    gridImg1: '/izesDIIpVhRGHCepu9trdoAcd3k.png', 
    gridImg2: '/nHbeBRK7mwYEJKWQhuO3N4euVE.png', 
    gridImg3: 'https://framerusercontent.com/images/zeKdJDWjwSiD0sOIBPDAIv9CY.png',
    description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity.",
    stats: [{ num: '800K', label: 'INTERACTIONS' }, { num: '90,3K', label: 'NEW FOLLOWERS' }]
  },
  "02": {
    client: 'FENDER',
    title: 'BASSMAN',
    year: '2024',
    heroVideo: 'https://framerusercontent.com/assets/6uAp36XGuFksZ4PXTRJV8pFkk.mp4', 
    quote: '"CRAFTING THE PERFECT SOUNDSCAPE FOR THE ICONIC FENDER BASSMAN REISSUE."',
    gridImg1: '/yBbkSWTAYb0ypoJGjlA2nd4nYo.png', 
    gridImg2: '/RtwPuPFvoGsBQl0XB7fr5liEXU.png', 
    gridImg3: '/fLZuS32GejbboIBYYFTqbvcXNIU.png',
    description: "Capturing the raw energy of analog sound. We focused on the tactile nature of the equipment to bring the classic Bassman legacy into a modern visual context.",
    stats: [{ num: '450K', label: 'VIEWS' }, { num: '12K', label: 'SHARES' }]
  },
  "03": {
    client: 'NIKE',
    title: 'JOGA BONITO 2.0',
    year: '2024',
    heroVideo: 'https://framerusercontent.com/assets/xmonK88eb6WLOHByQkME2Y1qXQ.mp4', 
    quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."', 
    gridImg1: '/ZyoY9VgUJdJie8Sx25XTCdFTSo.png', 
    gridImg2: '/AmjZDgRzsQwOMdQAkOeaQQwR0.png', 
    gridImg3: '/dXlwQgbRKc4FNN0JISG2vNHe2y4.png',
    description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity.",
    stats: [{ num: '800K', label: 'INTERACTIONS' }, { num: '90,3K', label: 'new followers' }]
  },
  "04": {
    client: 'REDBULL',
    title: 'COME RAIN OR SHINE',
    year: '2024',
    heroVideo: 'https://framerusercontent.com/assets/nZQGxSfvlsLwOCSf2kKYOOrmk.mp4', 
    quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."', 
    gridImg1: '/5AKYYKaUteYI46sSADeXMib3U.png', 
    gridImg2: '/kztjgxjP5q6dihKmK246paDScM.png', 
    gridImg3: '/U5QSJxGTMRLz7lSQFvWxUhGDfTw.png',
    description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity.",
    stats: [{ num: '800K', label: 'INTERACTIONS' }, { num: '90,3K', label: 'new followers' }]
  },
  "05": {
    client: 'EVERLAST',
    title: 'UNLEASH YOUR POWER',
    year: '2024',
    heroVideo: 'https://framerusercontent.com/assets/dzPvpthrM9IFbN344Wgh2GtL3EE.mp4',
    quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."',
    gridImg1: '/Jqd0S2le6Funti3d4TXTNELNvas.png', 
    gridImg2: '/xafrqn740cp1HsSF1Niqq3z7pZU.png', 
    gridImg3: '/jdwAELTBfLjUajvLUySINDgLnyI.png',
    description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity.",
    stats: [{ num: '800K', label: 'INTERACTIONS' }, { num: '90,3K', label: 'new followers' }]
  },
  "06": {
    client: 'SPOTIFY',
    title: 'TURN UP THE INNER VOLUME',
    year: '2024',
    heroVideo: 'https://framerusercontent.com/assets/PyWSeD0kT0UhEz6tHcGV11O7Zw.mp4', 
    quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."', 
    gridImg1: '/tQGnSHEHpZp1oU9HEMAg8VfnQ.png', 
    gridImg2: '/6uvNJTE051iU5ufChyYk2ReCQ.png', 
    gridImg3: '/4DnTR4CYMdSX99unSefMgjIKvtM.png',
    description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity.",
    stats: [{ num: '800K', label: 'INTERACTIONS' }, { num: '90,3K', label: 'new followers' }]
  },
  "07": {
    client: 'BENTLEY',
    title: 'THE SANDMAN',
    year: '2024',
    heroVideo: 'https://framerusercontent.com/assets/joghjsEYiDVY5GS1QMB3ciZnQ.mp4', 
    quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."', 
    gridImg1: '/8DmVo4XWdc66i5r7z2Pf9ct9NlA.png', 
    gridImg2: '/oBlvzVF4naUa02BzDK5tvjpzUFw.png', 
    gridImg3: '/Qskpn4sI8h2POZwWmFbfae6pQDU.png',
    description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity.",
    stats: [{ num: '800K', label: 'INTERACTIONS' }, { num: '90,3K', label: 'new followers' }]
  },
  "08": {
    client: 'RIP CURL',
    title: 'swimming with sharks',
    year: '2024',
    // Video asset URL extracted from your Project 08 HTML
    heroVideo: 'https://framerusercontent.com/assets/Qe1udnbiKxV6yE2SmuLL2TFmwuc.mp4', 
    quote: '"WE DELVE INTO EVERY DETAIL, CONNECTING THE STREETS TO ZERO\'S NEW COLLECTION."', 
    gridImg1: '/hcb6oWFIslUb9NML4hXg6gCajj4.png', 
    gridImg2: '/yxZHxNGHAJVpu9SLeW6pBvdZe0.png', 
    gridImg3: '/qBCcJDV0jbvPNLB4LeScZIYFtAc.png',
    description: "From meticulous scriptwriting to dynamic filming, precise post-production, and editing, we ensure every aspect of the advertisement aligns with the brand's identity. our commitment to authenticity guarantees a compelling narrative that elevates zero's presence in the skateboarding world.",
    stats: [{ num: '800K', label: 'INTERACTIONS' }, { num: '90,3K', label: 'new followers' }]
  }
};

const teamCredits = [
  { name: 'ANDRÉ LACERDA', role: 'DESIGN' },
  { name: 'Hanri Lamarca', role: 'PHOTOGRAPHY' },
  { name: 'ERIKKA KLAUS', role: 'director' },
  { name: 'Christian Zanini', role: 'Post-production' }
];

const framerEase = [0.44, 0, 0.56, 1];

export default function ProjectDetail() {
  const { id } = useParams();
  
  // Select data based on ID, default to project 01 if not found
  const data = projectsData[id || "01"] || projectsData["01"];

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
      
      {/* 1. BACKGROUND VERTICAL GRID LINES */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ width: '100%', maxWidth: '1440px', display: 'flex', justifyContent: 'space-between', padding: '0 80px', boxSizing: 'border-box' }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ width: '1px', height: '100%', backgroundColor: '#121212' }} />
          ))}
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1440px', padding: '0 80px', boxSizing: 'border-box' }}>
        
        {/* 2. HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: framerEase }}>
          <div style={{ marginBottom: '32px' }}>
            <Link to="/work" style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: '#8F8F8F', textDecoration: 'none', letterSpacing: '1px' }}>
              ← back work
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <h2 style={{ fontFamily: '"Panchang", sans-serif', fontSize: '56px', fontWeight: 300, margin: 0 }}>
                {data.client}
              </h2>
              <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '56px', fontWeight: 400, margin: 0, letterSpacing: '1px' }}>
                {data.title}
              </h1>
            </div>
            <h5 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '32px', fontWeight: 400, margin: 0 }}>
              {data.year}
            </h5>
          </div>
        </motion.div>

        {/* 3. HERO VIDEO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: framerEase }}
          style={{ width: '100%', height: '80vh', overflow: 'hidden', marginTop: '50px' }}
        >
          <video key={data.heroVideo} src={data.heroVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </motion.div>

        {/* 4. QUOTES SECTION (50% Offset) */}
        <div style={{ display: 'flex', marginTop: '100px' }}>
          <div style={{ width: '50%' }} /> 
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: '"Panchang", sans-serif', fontSize: '28px', fontWeight: 300, lineHeight: '1.4', margin: 0 }}>
              {data.quote}
            </p>
          </div>
        </div>

        {/* 5. MIDDLE GRIDS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '162px', marginTop: '162px' }}>
          
          {/* Grid-01: Staggered columns */}
          <div style={{ display: 'flex', gap: '32px', height: '400px' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img src={data.gridImg1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, display: 'flex' }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <img src={data.gridImg2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ width: '50%' }} /> 
            </div>
          </div>

          {/* Grid-02: Text + Image */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: '"Panchang", sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.6', margin: 0, paddingRight: '16px' }}>
                {data.description}
              </p>
            </div>
            <div style={{ flex: 1, height: '400px', overflow: 'hidden' }}>
              <img src={data.gridImg3} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* 6. ANALYTICS (Split 50/50) */}
        <div style={{ display: 'flex', marginTop: '120px' }}>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: '"Panchang", sans-serif', fontSize: '56px', fontWeight: 700, lineHeight: '1' }}>{data.stats[0].num || data.stats[0].number}</span>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: '#8F8F8F', letterSpacing: '1px', textTransform: 'uppercase' }}>{data.stats[0].label}</span>
          </div>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px' }}>
            <span style={{ fontFamily: '"Panchang", sans-serif', fontSize: '56px', fontWeight: 700, lineHeight: '1' }}>{data.stats[1].num || data.stats[1].number}</span>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: '#8F8F8F', letterSpacing: '1px', textTransform: 'uppercase' }}>{data.stats[1].label}</span>
          </div>
        </div>

        {/* 7. TEAM CREDITS */}
        <div style={{ display: 'flex', marginTop: '120px' }}>
          <div style={{ width: '50%' }} /> 
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '16px' }}>
            {teamCredits.map((member, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '78px', justifyContent: 'flex-start' }}>
                <div style={{ width: '100%', height: '1px', backgroundColor: 'rgb(150, 150, 150)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', letterSpacing: '1px' }}>{member.name}</span>
                  <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: '#8F8F8F', letterSpacing: '1px', textTransform: 'uppercase' }}>{member.role}</span>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgb(150, 150, 150)' }} />
          </div>
        </div>

      </div>
    </div>
  );
}