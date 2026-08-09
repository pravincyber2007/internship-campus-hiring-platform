import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postInternship } from '../services/api';

function CompanyDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stipend, setStipend] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      await postInternship({ title, description, stipend, location }, token);
      setMessage('Internship posted successfully!');
      setTitle('');
      setDescription('');
      setStipend('');
      setLocation('');
    } catch (err) {
      setMessage('Failed to post internship. Check authorization.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '600px', margin: 'auto' }}>
      <h2>Company Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleLogout} style={{ background: '#fff', color: '#000', border: '1px solid #000', padding: '5px 10px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ border: '1px solid #000', padding: '20px' }}>
        <h3>Post an Internship</h3>
        <form onSubmit={handlePost}>
          <div style={{ marginBottom: '10px' }}>
            <label>Title:</label><br />
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #000', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Description:</label><br />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #000', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Stipend:</label><br />
            <input type="text" value={stipend} onChange={(e) => setStipend(e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #000', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Location:</label><br />
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: '100%', padding: '6px', border: '1px solid #000', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ padding: '8px 15px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Post Internship
          </button>
        </form>
        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
      <p style={{ marginTop: '20px' }}><Link to="/" style={{ color: '#000' }}>Home</Link></p>
    </div>
  );
}

export default CompanyDashboard;