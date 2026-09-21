import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function CompanyDashboard({ isAuthenticated, userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState('post');
  const [companyName, setCompanyName] = useState('Recruiter');
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  
  const [formData, setFormData] = useState({ title: '', domain: '', stipend: '', duration: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Helper function to safely extract user ID from localStorage
  const getStoredUserId = () => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.user_id || parsedUser.id;
        } catch (err) {
          console.error("Error parsing stored user", err);
        }
      }
    }
    return userId;
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setError('');
        const userId = getStoredUserId();
        if (!userId) {
          setError("User ID not found. Please log in again.");
          return;
        }
        
        setCompanyName('Recruiter');

        // FIXED: Changed from /api/internships/ to /api/internship (singular)
        const listRes = await API.get('/api/internships');
        const compInternships = listRes.data.filter(i => String(i.user_id) === String(userId));
        setInternships(compInternships);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Could not load company dashboard data. Please check your backend connection.");
      }
    };
    fetchCompanyData();
  }, [activeTab]);

  const handlePostInternship = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const userId = getStoredUserId();
    if (!userId) {
      setError("User session not found. Please log in again.");
      return;
    }

    try {
      // FIXED: Changed from /api/internships/ to /api/internship (singular)
      await API.post('/api/internships', {
        user_id: parseInt(userId, 10),
        title: formData.title,
        domain: formData.domain,
        stipend: parseInt(formData.stipend, 10),
        duration: formData.duration
      });
      setMessage("Internship posted successfully!");
      setFormData({ title: '', domain: '', stipend: '', duration: '' });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to post internship.");
    }
  };

  const handleSelectInternship = async (internship) => {
    setSelectedInternship(internship);
    try {
      const res = await API.get(`/api/applications/internships/${internship.internship_id}/applicants`);
      setApplicants(res.data);
    } catch {
      setApplicants([]);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await API.put(`/api/applications/${applicationId}/status`, { status: newStatus });
      const res = await API.get(`/api/applications/internships/${selectedInternship.internship_id}/applicants`);
      setApplicants(res.data);
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>Welcome, {companyName}</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your corporate postings and review incoming applicants.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => { setActiveTab('post'); setSelectedInternship(null); }} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: activeTab === 'post' ? 'none' : '1px solid #cbd5e1', background: activeTab === 'post' ? '#2563eb' : '#fff', color: activeTab === 'post' ? '#fff' : '#334155', fontWeight: '600', cursor: 'pointer' }}>
            ➕ Post Internship
          </button>
          <button onClick={() => setActiveTab('list')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: activeTab === 'list' ? 'none' : '1px solid #cbd5e1', background: activeTab === 'list' ? '#2563eb' : '#fff', color: activeTab === 'list' ? '#fff' : '#334155', fontWeight: '600', cursor: 'pointer' }}>
            📂 Our Internships
          </button>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
        {message && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{message}</div>}

        {activeTab === 'post' && (
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: '600' }}>Post New Opportunity</h3>
            <form onSubmit={handlePostInternship}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Internship Title</label>
                <input type="text" placeholder="e.g. Cybersecurity Intern" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Domain</label>
                <input type="text" placeholder="e.g. Cyber Security / Full Stack" value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Stipend (₹ / month)</label>
                <input type="number" placeholder="15000" value={formData.stipend} onChange={(e) => setFormData({...formData, stipend: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Duration</label>
                <input type="text" placeholder="3 Months" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
              </div>
              <button type="submit" style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Publish Listing</button>
            </form>
          </div>
        )}

        {activeTab === 'list' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedInternship ? '1fr 2fr' : '1fr', gap: '2rem' }}>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Active Live Postings</h3>
              {internships.length === 0 ? (
                <p style={{ color: '#64748b' }}>No internships posted yet.</p>
              ) : (
                internships.map(i => (
                  <div key={i.internship_id} onClick={() => handleSelectInternship(i)} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.75rem', cursor: 'pointer', background: selectedInternship?.internship_id === i.internship_id ? '#eff6ff' : '#fff' }}>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{i.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{i.domain} • ₹{i.stipend} / mo</div>
                  </div>
                ))
              )}
            </div>

            {selectedInternship && (
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Applicants for: {selectedInternship.title}</h3>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2563eb', marginBottom: '1.5rem' }}>
                  Total Students Applied: {applicants.length}
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
                      <th style={{ padding: '0.75rem 1rem' }}>CGPA</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Skills</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.length === 0 ? (
                      <tr><td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>No students have applied for this listing yet.</td></tr>
                    ) : (
                      applicants.map(app => (
                        <tr key={app.application_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{app.student?.name}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>{app.student?.cgpa}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{app.student?.skills}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <select 
                              value={app.status} 
                              onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                              style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '600', color: app.status === 'Accepted' ? '#16a34a' : app.status === 'Rejected' ? '#dc2626' : '#2563eb' }}
                            >
                              <option value="Applied">Applied</option>
                              <option value="On Review">On Review</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
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