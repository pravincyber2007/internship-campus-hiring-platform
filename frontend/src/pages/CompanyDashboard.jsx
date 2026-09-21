import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function CompanyDashboard({ isAuthenticated, userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState('post'); // 'post' or 'list'
  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    stipend: '',
    duration: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getStoredUserId = () => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          userId = parsed.user_id || parsed.id;
        } catch (err) {
          console.error("Error parsing user storage", err);
        }
      }
    }
    return userId;
  };

  const fetchCompanyInternships = async () => {
    setActiveTab('list');
    setError('');
    try {
      const userId = getStoredUserId();
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }
      const res = await API.get(`/api/company/internships/${userId}`);
      setInternships(res.data || []);
      
      // Also fetch applicants for review
      const appRes = await API.get(`/api/company/internship-applicants/${userId}`);
      setApplicants(appRes.data || []);
    } catch (err) {
      console.error("Error fetching company internships", err);
      setError("Could not load your internships.");
    }
  };

  const handlePostInternship = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const userId = getStoredUserId();
      // First ensure we have company profile or pass user info correctly
      await API.post('/api/internships', {
        ...formData,
        user_id: parseInt(userId, 10),
        stipend: parseFloat(formData.stipend)
      });
      setMessage("Internship posted successfully!");
      setFormData({ title: '', domain: '', stipend: '', duration: '' });
      fetchCompanyInternships();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to post internship.");
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/api/company/application-status/${appId}`, { status: newStatus });
      // Refresh list
      fetchCompanyInternships();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.3rem' }}>Welcome, Recruiter</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your corporate postings and review incoming applicants.</p>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
        {message && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{message}</div>}

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('post')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: activeTab === 'post' ? 'none' : '1px solid #cbd5e1', 
              background: activeTab === 'post' ? '#2563eb' : '#fff', 
              color: activeTab === 'post' ? '#fff' : '#334155', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            ➕ Post Internship
          </button>
          
          <button 
            onClick={fetchCompanyInternships} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: activeTab === 'list' ? 'none' : '1px solid #cbd5e1', 
              background: activeTab === 'list' ? '#2563eb' : '#fff', 
              color: activeTab === 'list' ? '#fff' : '#334155', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            📁 Our Internships & Applicants
          </button>
        </div>

        {/* Post Internship Form */}
        {activeTab === 'post' && (
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Create New Internship Posting</h2>
            <form onSubmit={handlePostInternship} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>Job Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>Domain</label>
                <input 
                  type="text" 
                  value={formData.domain} 
                  onChange={e => setFormData({...formData, domain: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>Stipend (₹ / month)</label>
                <input 
                  type="number" 
                  value={formData.stipend} 
                  onChange={e => setFormData({...formData, stipend: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>Duration</label>
                <input 
                  type="text" 
                  value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: e.target.value})} 
                  required 
                  placeholder="e.g., 3 Months"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
                Publish Internship
              </button>
            </form>
          </div>
        )}

        {/* Our Internships & Applicants View */}
        {activeTab === 'list' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Active Live Postings ({internships.length})</h2>
            {internships.length === 0 ? (
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                No internships posted yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {internships.map(i => (
                  <div key={i.internship_id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>{i.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Domain: {i.domain} • Stipend: ₹{i.stipend} / mo</p>
                    <p style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: '600' }}>Applicants: {i.applicant_count || 0}</p>
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Manage Applicants</h2>
            {applicants.length === 0 ? (
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                No students have applied to your internships yet.
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#334155', fontSize: '0.85rem' }}>
                      <th style={{ padding: '1rem' }}>Student Name</th>
                      <th style={{ padding: '1rem' }}>College Name</th>
                      <th style={{ padding: '1rem' }}>Internship Title</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map(app => (
                      <tr key={app.application_id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>{app.student_name}</td>
                        <td style={{ padding: '1rem', color: '#64748b' }}>{app.college_name}</td>
                        <td style={{ padding: '1rem', color: '#334155' }}>{app.internship_title}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '9999px', 
                            fontSize: '0.75rem', 
                            fontWeight: '700', 
                            textTransform: 'uppercase',
                            background: app.status === 'accepted' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : app.status === 'onreview' ? '#fef9c3' : '#dbeafe',
                            color: app.status === 'accepted' ? '#15803d' : app.status === 'rejected' ? '#b91c1c' : app.status === 'onreview' ? '#a16207' : '#1d4ed8'
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <select 
                            value={app.status} 
                            onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                            style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          >
                            <option value="applied">Applied</option>
                            <option value="onreview">On Review</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}