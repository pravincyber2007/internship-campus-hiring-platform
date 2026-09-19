import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage({ isAuthenticated, userRole, onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      
      {/* Hero Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem', border: '1px solid #bfdbfe' }}>
          🚀 Campus-Wide Internship & Hiring Ecosystem
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', marginBottom: '1.5rem' }}>
          Connecting Top Campus Talent with Industry Leaders
        </h1>
        
        <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '700px' }}>
          A secure, multi-role platform designed for students to discover verified opportunities, companies to manage candidate pipelines, and T&P administrators to track institutional progress seamlessly.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/auth')} 
            style={{ background: '#2563eb', color: '#fff', padding: '0.85rem 2rem', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
          >
            Get Started / Sign In
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '5rem', width: '100%', textAlign: 'left' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎓</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>For Students</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Explore live listings from top corporate partners, apply instantly, and track real-time application statuses.</p>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏢</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>For Companies</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Publish internship opportunities, view detailed candidate profiles (CGPA & skills), and manage hiring pipelines.</p>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏛️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>For T&P Admins</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Monitor institutional student engagement, track college-wide participation, and view active recruitment roasters.</p>
          </div>
        </div>

      </div>
    </div>
  );
}