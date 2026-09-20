import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function AuthPage({ isAuthenticated, userRole, onLogout, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    name: '',
    college_code: '',
    college_name: '',
    cgpa: '',
    skills: '',
    company_name: '',
    industry: '',
    admin_name: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (!isLogin) {
        // --- Registration Request (Added /api prefix) ---
        await API.post('/api/auth/register', {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          college_name: formData.college_name,
          college_code: formData.college_code,
          cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
          skills: formData.skills,
          company_name: formData.company_name,
          industry: formData.industry,
          admin_name: formData.admin_name
        });

        setMessage("Account registered successfully! Please sign in.");
        setIsLogin(true);
      } else {
        // --- Secure Login Request (Added /api prefix) ---
        const response = await API.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        // Store authentic user identity in browser storage
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('role', response.data.role);

        onLoginSuccess(response.data.role);

        // Redirect based on actual database role
        if (response.data.role === 'student') navigate('/student/dashboard');
        else if (response.data.role === 'company') navigate('/company/dashboard');
        else if (response.data.role === 'admin') navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication request failed. Please check network connection.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '500px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {isLogin ? 'Sign in to access your portal' : 'Enter Correct Details to Register'}
            </p>
          </div>

          {message && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}
          {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>Email Address</label>
              <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} required />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>Password</label>
              <input type="password" name="password" placeholder="••••••" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} required />
            </div>

            {!isLogin && (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>Portal Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' }}>
                    <option value="student">Student</option>
                    <option value="company">Company Recruiter</option>
                    <option value="admin">T&P Admin</option>
                  </select>
                </div>

                {formData.role === 'student' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563eb', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Student Profile Schema Fields</div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>Full Name</label>
                      <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>College Name</label>
                      <input type="text" name="college_name" placeholder="J.J. College of Engg" value={formData.college_name} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>College Code</label>
                      <input type="text" name="college_code" placeholder="e.g. 4567" value={formData.college_code} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>CGPA</label>
                      <input type="number" step="0.01" name="cgpa" placeholder="8.5" value={formData.cgpa} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>Skills</label>
                      <input type="text" name="skills" placeholder="Python, React, SQL" value={formData.skills} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>
                )}

                {formData.role === 'company' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16a34a', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Company Profile Schema Fields</div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>Company Name</label>
                      <input type="text" name="company_name" placeholder="Tech Corp" value={formData.company_name} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>Industry</label>
                      <input type="text" name="industry" placeholder="Software & Cyber Security" value={formData.industry} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>
                )}

                {formData.role === 'admin' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#dc2626', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Admin Profile Schema Fields</div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>Administrator Name</label>
                      <input type="text" name="admin_name" placeholder="Placement Officer" value={formData.admin_name} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>College Name</label>
                      <input type="text" name="college_name" placeholder="J.J. College of Engineering" value={formData.college_name} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.2rem' }}>Institutional College Code</label>
                      <input type="text" name="college_code" placeholder="e.g. 4567" value={formData.college_code} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>
                )}
              </>
            )}

            <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              {isLogin ? 'Sign In' : 'Register Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            <button onClick={() => { setIsLogin(!isLogin); setMessage(''); setError(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>
              {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}