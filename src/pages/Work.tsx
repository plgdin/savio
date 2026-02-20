import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import React from 'react';

export default function WorkList() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '150px', maxWidth: '1400px', margin: '0 auto' }}>
      {projects.map((project) => (
        <div 
          key={project.id}
          onMouseEnter={() => setHovered(project.heroImage)}
          onMouseLeave={() => setHovered(null)}
          style={{ position: 'relative', borderBottom: '1px solid #333' }}
        >
          <Link to={`/project/${project.id}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '40px 20px', textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3rem', fontWeight: 300 }}>{project.client}</span>
              <span style={{ fontSize: '2rem', fontWeight: 900 }}>{project.title}</span>
            </div>
            {/* Arrow Icon */}
            <div style={{ fontSize: '2rem' }}>↗</div>
          </Link>
        </div>
      ))}

      {/* Floating Hover Image */}
      {hovered && (
        <div style={{
          position: 'fixed', top: '20%', right: '10%', 
          width: '400px', height: '250px', 
          backgroundImage: `url(${hovered})`, backgroundSize: 'cover',
          pointerEvents: 'none', zIndex: 10
        }} />
      )}
    </div>
  );
}