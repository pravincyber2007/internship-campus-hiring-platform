import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function StudentDashboard({ isAuthenticated, userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState('internships');
  const [studentProfile, setStudentProfile] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;
        
        const profileRes = await API.get(`/profiles/student/user/${userId}`).catch(() => null);
        if (profileRes) {
          setStudentProfile(profileRes.data);
          const appsRes = await API.get(`/applications/student/${profileRes.data.profile_id}`).catch(() => ({ data: [] }));
          setApplications(appsRes.data);
        }

        const internshipsRes = await API.get('/internships/').catch(() => ({ data: [] }));
        setInternships(internshipsRes.data);
      } catch {
        setError("Could not load student dashboard data.");
      }
    };
    fetchStudentData();
  }, [activeTab]);

  const handleApply = async (internshipId) => {
    setMessage('');
    setError('');
    try {
      await API.post('/applications/', {
        student_id: studentProfile.profile_id,
        internship_id: internshipId
      });
      setMessage("Successfully applied for internship!");
      const appsRes = await API.get(`/applications/student/${studentProfile.profile_id}`);
      setApplications(appsRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit application.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>Welcome Back, {studentProfile?.name || 'Student'}</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Institution Code: <strong>{studentProfile?.college_code}</strong> ({studentProfile?.college_name})</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#475569' }}>
            <div>CGPA: <strong>{studentProfile?.cgpa}</strong></div>
            <div>Skills: {studentProfile?.skills}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('internships')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'internships' ? '#2563eb' : '#fff', color: activeTab === 'internships' ? '#fff' : '#334155', fontWeight: '600', cursor: 'pointer', border: activeTab === 'internships' ? 'none' : '1px solid #cbd5e1' }}>
            💼 Available Internships
          </button>
          <button onClick={() => setActiveTab('status')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'status' ? '#2563eb' : '#fff', color: activeTab === 'status' ? '#fff' : '#334155', fontWeight: '600', cursor: 'pointer', border: activeTab === 'status' ? 'none' : '1px solid #cbd5e1' }}>
            📊 Internship Status Tracker
          </button>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
        {message && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{message}</div>}

        {activeTab === 'internships' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {internships.length === 0 ? (
              <p style={{ color: '#64748b' }}>No internship opportunities posted yet.</p>
            ) : (
              internships.map(i => {
                const hasApplied = applications.some(app => app.internship_id === i.internship_id);
                return (
                  <div key={i.internship_id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.2rem' }}>🏢 {i.company_name}</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.3rem' }}>{i.title}</h3>
                      <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: '500', marginBottom: '0.75rem' }}>Domain: {i.domain}</div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Stipend: ₹{i.stipend} / month • Duration: {i.duration}</p>
                    </div>
                    <button 
                      onClick={() => handleApply(i.internship_id)} 
                      disabled={hasApplied} 
                      style={{ width: '100%', background: hasApplied ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', fontWeight: '600', cursor: hasApplied ? 'not-allowed' : 'pointer' }}
                    >
                      {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'status' && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Internship & Company</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Domain</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>You have not applied for any internships yet.</td></tr>
                ) : (
                  applications.map(app => (
                    <tr key={app.application_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{app.internship_title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '500' }}>🏢 {app.company_name}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{app.domain}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                        <span style={{ 
                          background: app.status === 'Accepted' ? '#f0fdf4' : app.status === 'Rejected' ? '#fef2f2' : '#eff6ff', 
                          color: app.status === 'Accepted' ? '#16a34a' : app.status === 'Rejected' ? '#dc2626' : '#2563eb',
                          padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1px solid #cbd5e1' 
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{app.applied_date || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}