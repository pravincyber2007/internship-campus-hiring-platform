import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCompany, registerStudent } from '../services/api';

function Register() {
  const [role, setRole] = useState('company'); // 'company' or 'student'
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Extra fields for Company
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');

  // Extra fields for Student
  const [collegeName, setCollegeName] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [skills, setSkills] = useState('');

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (role === 'company') {
        const companyData = {
          name,
          email,
          password,
          industry: industry || 'IT',
          description: description || 'Technology Company'
        };
        await registerCompany(companyData);
      } else {
        const studentData = {
          name,
          email,
          password,
          college_name: collegeName || 'College',
          cgpa: cgpa ? parseFloat(cgpa) : 0.0,
          skills: skills || 'Python, React'
        };
        await registerStudent(studentData);
      }

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Registration Error:', err.response?.data || err.message);
      setMessage('Registration failed. Check details.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      
      {/* Role Toggle Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setRole('company')}
          style={{
            background: role === 'company' ? '#000' : '#fff',
            color: role === 'company' ? '#fff' : '#000',
            border: '1px solid #000',
            padding: '8px 15px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Company
        </button>
        <button
          onClick={() => setRole('student')}
          style={{
            background: role === 'student' ? '#000' : '#fff',
            color: role === 'student' ? '#fff' : '#000',
            border: '1px solid #000',
            padding: '8px 15px',
            cursor: 'pointer'
          }}
        >
          Student
        </button>
      </div>

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label>{role === 'company' ? 'Company Name:' : 'Full Name:'}</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {role === 'company' ? (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label>Industry:</label>
              <br />
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g. Software"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Description:</label>
              <br />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="Short description"
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label>College Name:</label>
              <br />
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>CGPA:</label>
              <br />
              <input
                type="number"
                step="0.01"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Skills:</label>
              <br />
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g. React, Python"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Register as {role}
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <p style={{ marginTop: '20px' }}>
        Already registered? <Link to="/login" style={{ color: '#000' }}>Login</Link> | <Link to="/" style={{ color: '#000' }}>Home</Link>
      </p>
    </div>
  );
}

export default Register;