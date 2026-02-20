import { useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import React from 'react';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <div>Project not found</div>;

  return (
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '120px 40px 40px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>{project.client} <span style={{ fontWeight: 300 }}>{project.title}</span></h1>
        <span style={{ fontSize: '2rem' }}>{project.year}</span>
      </div>

      {/* Hero Image */}
      <div style={{ width: '100%', height: '80vh', overflow: 'hidden' }}>
        <img src={project.heroImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Hero" />
      </div>

      {/* Stats & Description Grid */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', 
        gap: '40px', padding: '100px 40px', borderBottom: '1px solid #333'
      }}>
        <div>
          <p style={{ fontSize: '2rem', maxWidth: '500px' }}>"{project.description}"</p>
        </div>
        <div style={{ display: 'flex', gap: '80px' }}>
          <div>
            <h3 style={{ fontSize: '3rem', margin: 0 }}>{project.stats.interactions}</h3>
            <span style={{ color: '#888' }}>INTERACTIONS</span>
          </div>
          <div>
            <h3 style={{ fontSize: '3rem', margin: 0 }}>{project.stats.followers}</h3>
            <span style={{ color: '#888' }}>NEW FOLLOWERS</span>
          </div>
        </div>
      </div>
      
      {/* Simple Footer/Credits Mockup */}
      <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div>Design: André</div>
        <div>Photo: Hanri</div>
        <div>Director: Erikka</div>
        <div>Post: Christian</div>
      </div>
    </div>
  );
}