import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      {/* SECTION 1: Contact Information */}
      <div style={contentWrapper}>
        <div style={sectionStyle}>
          <div style={groupStyle}>
            <p style={addressStyle}>5905 Wilshire Blvd, Los Angeles, CA 90036, United States of America</p>
            <p style={brandStyle}>PANORAMA FILMS</p>
          </div>
          <div style={spacerStyle} />
          <div style={groupStyle}>
            <a href="https://twitter.com/home" target="_blank" rel="noopener" style={linkStyle}>TWITTER (X)</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener" style={linkStyle}>INSTAGRAM</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener" style={linkStyle}>LINKEDIN</a>
          </div>
          <div style={spacerStyle} />
        </div>

        <div style={sectionStyle}>
          <div style={spacerStyle} />
          <div style={groupStyle}>
            <p style={contactInfoStyle}>hello@panorama.com<br />+2 8733-2200</p>
            <a href="mailto:name@email.com" target="_blank" rel="noopener" style={linkStyle}>SAY HELLO</a>
          </div>
          <div style={spacerStyle} />
          <div style={groupStyle}>
            <p style={copyrightStyle}>CRAFTED BY<br />© ANDRÉ LACERDA</p>
            <a href="https://x.com/deco_lacerda" target="_blank" rel="noopener" style={linkStyle}>FOLLOW ME</a>
          </div>
        </div>
      </div>

      {/* SECTION 2: WHITE SCROLLING MARQUEE (The code you provided) */}
      <div style={marqueeContainer}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ display: 'flex', width: 'fit-content' }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} style={marqueeItem}>
              <p style={marqueeText}>
                Panorama <span style={{ fontFamily: '"Panchang", sans-serif' }}>FILMES   </span>
                CRAFTED BY ANDRÉ LACERDA
                <span style={{ fontFamily: '"Panchang", sans-serif' }}>   PLGDIN TEMPLATE   </span>
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </footer>
  );
};

// --- Styles for the Main Footer ---
const footerStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#000',
  paddingTop: '80px',
  boxSizing: 'border-box',
  position: 'relative',
  zIndex: 10
};

const contentWrapper: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 80px 80px', // Bottom padding for spacing before marquee
  boxSizing: 'border-box'
};

// --- Styles for the White Marquee Bar ---
const marqueeContainer: React.CSSProperties = {
  width: '100%',
  height: '32px',
  backgroundColor: '#ffffff', // Exact background from source
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  marginTop: '40px',
  marginBottom: '100px' // Space for floating Menu button
};

const marqueeItem: React.CSSProperties = {
  flexShrink: 0,
  paddingRight: '20px'
};

const marqueeText: React.CSSProperties = {
  fontFamily: '"Bebas Neue", sans-serif',
  fontSize: '24px', // Exact size from source
  color: '#000000',
  margin: 0,
  whiteSpace: 'nowrap',
  textTransform: 'uppercase'
};

// --- Common Section Styles ---
const sectionStyle: React.CSSProperties = { display: 'flex', flex: 1, justifyContent: 'space-between' };
const groupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '16px' };
const textBase: React.CSSProperties = { fontFamily: '"Bebas Neue", sans-serif', color: '#fff', textDecoration: 'none', textTransform: 'uppercase' };
const addressStyle: React.CSSProperties = { ...textBase, maxWidth: '250px', opacity: 0.6, fontSize: '14px' };
const brandStyle: React.CSSProperties = { ...textBase, fontWeight: 700, fontSize: '18px' };
const contactInfoStyle: React.CSSProperties = { ...textBase, lineHeight: '1.4', opacity: 0.6, fontSize: '14px' };
const copyrightStyle: React.CSSProperties = { ...textBase, opacity: 0.6, fontSize: '14px' };
const linkStyle: React.CSSProperties = { ...textBase, fontSize: '18px', cursor: 'pointer' };
const spacerStyle: React.CSSProperties = { flex: 1 };

export default Footer;