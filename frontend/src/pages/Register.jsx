import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCompany, registerStudent } from '../services/api';

function Register() {
  const [role, setRole] = useState('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Student specific
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [skills, setSkills] = useState('');

  // Company specific
  const [companyName, setCompanyName] = useState('');

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (role === 'company') {
        await registerCompany({ name: companyName, email, password });
        setMessage('Company registered successfully. Redirecting to login...');
      } else {
        await registerStudent({ name, email, password, college_name: collegeName, cgpa: parseFloat(cgpa), skills });
        setMessage('Student registered successfully. Redirecting to login...');
      }
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage('Registration failed. Check details.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setRole('company')} 
          style={{ background: role === 'company' ? '#000' : '#fff', color: role === 'company' ? '#fff' : '#000', border: '1px solid #000', padding: '5px 10px', cursor: 'pointer' }}
        >
          Company
        </button>
        <button 
          onClick={() => setRole('student')} 
          style={{ background: role === 'student' ? '#000' : '#fff', color: role === 'student' ? '#fff' : '#000', border: '1px solid #000', padding: '5px 10px', cursor: 'pointer' }}
        >
          Student
        </button>
      </div>

      <form onSubmit={handleRegister}>
        {role === 'student' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label>Full Name:</label><br />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>College Name:</label><br />
              <input type="text" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>CGPA:</label><br />
              <input type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Skills:</label><br />
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }} />
            </div>
          </>
        )}

        {role === 'company' && (
          <div style={{ marginBottom: '15px' }}>
            <label>Company Name:</label><br />
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }} />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Register as {role}
        </button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}

      <p style={{ marginTop: '20px' }}>
        Already registered? <Link to="/login" style={{ color: '#000' }}>Login</Link> | <Link to="/" style={{ color: '#000' }}>Home</Link>
      </p>
    </div>
  );
}

export default Register;