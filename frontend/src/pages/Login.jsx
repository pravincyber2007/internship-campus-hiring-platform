import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginCompany, loginStudent } from '../services/api';

function Login() {
  const [role, setRole] = useState('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (role === 'company') {
        const res = await loginCompany({ email, password });
        localStorage.setItem('token', res.data.access_token);
        navigate('/company/dashboard');
      } else {
        const res = await loginStudent({ email, password });
        localStorage.setItem('token', res.data.access_token || 'student_token');
        navigate('/student/dashboard');
      }
    } catch (err) {
      setMessage('Login failed. Check credentials.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      
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

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label><br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', border: '1px solid #000', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Login as {role}
        </button>
      </form>
      
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      
      <p style={{ marginTop: '20px' }}>
        New here? <Link to="/register" style={{ color: '#000' }}>Register</Link> | <Link to="/" style={{ color: '#000' }}>Home</Link>
      </p>
    </div>
  );
}

export default Login;