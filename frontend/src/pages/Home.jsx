import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '600px', margin: 'auto' }}>
      <h1>Campus Hiring Platform</h1>
      <p>Simple platform for student internships and company recruitment.</p>
      <hr style={{ margin: '20px 0' }} />
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/login" style={{ color: '#000', textDecoration: 'underline' }}>Login</Link>
        <Link to="/register" style={{ color: '#000', textDecoration: 'underline' }}>Register</Link>
      </div>
    </div>
  );
}

export default Home;