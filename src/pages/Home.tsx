import TunnelScene from '../components/TunnelScene'; // Import the 3D code
import React from 'react';

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', inset: 0 }}>
       <TunnelScene />
       {/* You can overlay text here if needed, but the scene has it */}
    </div>
  );
}