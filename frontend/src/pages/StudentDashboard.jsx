import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getInternships } from '../services/api';

function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await getInternships();
      console.log("Backend Response:", res.data);
      setInternships(res.data);
    } catch (err) {
      setMessage('Failed to load internships.');
      console.error("Fetch Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '600px', margin: 'auto' }}>
      <h2>Student Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleLogout} style={{ background: '#fff', color: '#000', border: '1px solid #000', padding: '5px 10px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <h3>Available Internships</h3>
      {message && <p>{message}</p>}
      {internships.length === 0 ? (
        <p>No internships available right now.</p>
      ) : (
        internships.map((item, index) => (
          <div key={index} style={{ border: '1px solid #000', padding: '15px', marginBottom: '10px' }}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <p><strong>Stipend:</strong> {item.stipend}</p>
            <p><strong>Location:</strong> {item.location}</p>
          </div>
        ))
      )}
      <p style={{ marginTop: '20px' }}><Link to="/" style={{ color: '#000' }}>Home</Link></p>
    </div>
  );
}

export default StudentDashboard;