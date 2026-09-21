import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function StudentDashboard({ isAuthenticated, userRole, onLogout }) {
  const [studentName, setStudentName] = useState('Pravin');
  const [cgpa, setCgpa] = useState('8.5');
  const [skills, setSkills] = useState('Python, React');
  const [institutionCode, setInstitutionCode] = useState('JJ1478');
  const [internships, setInternships] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loadingTracker, setLoadingTracker] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getStoredUserId = () => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          userId = parsed.user_id || parsed.id || parsed.sub;
        } catch (err) {
          console.error("Error parsing stored user", err);
        }
      }
    }
    return userId || 1; // Fallback to ID 1 to prevent null crashes
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setError('');
        const userId = getStoredUserId();

        // Fetch profile
        try {
          const profileRes = await API.get(`/api/student/profile/${userId}`);
          if (profileRes.data) {
            setStudentName(profileRes.data.name || 'Pravin');
            setCgpa(profileRes.data.cgpa || '8.5');
            setSkills(profileRes.data.skills || 'Python, React');
            setInstitutionCode(profileRes.data.college_code || profileRes.data.institution_code || 'JJ1478');
          }
        } catch (profileErr) {
          console.warn("Profile fetch warning, using defaults:", profileErr);
        }

        // Fetch available internships
        const internshipRes = await API.get('/api/internship');
        setInternships(internshipRes.data || []);
      } catch (err) {
        console.error("Student dashboard fetch error:", err);
        setError("Could not load student dashboard data.");
      }
    };

    fetchStudentData();
  }, []);

  const fetchTracker = async () => {
    setActiveTab('tracker');
    setLoadingTracker(true);
    setError('');
    try {
      const userId = getStoredUserId();
      const res = await API.get(`/api/applications/tracker/${userId}`);
      setMyApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching tracker", err);
      setError("Could not load your applications tracker.");
    } finally {
      setLoadingTracker(false);
    }
  };

  const handleApply = async (internshipId) => {
    setMessage('');
    setError('');
    const userId = getStoredUserId();
    try {
      await API.post('/api/applications/', {
        student_id: parseInt(userId, 10),
        internship_id: internshipId
      });
      setMessage("Successfully applied for internship!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to apply for internship.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Profile Card */}
        <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.3rem' }}>Welcome Back, {studentName}</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Institution Code: {institutionCode}</p>
          </div>
          <div style={{ textAlign: 'right', color: '#334155', fontSize: '0.95rem' }}>
            <div><strong>CGPA:</strong> {cgpa}</div>
            <div style={{ marginTop: '0.2rem' }}><strong>Skills:</strong> {skills}</div>
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
        {message && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{message}</div>}

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('available')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: activeTab === 'available' ? 'none' : '1px solid #cbd5e1', 
              background: activeTab === 'available' ? '#2563eb' : '#fff', 
              color: activeTab === 'available' ? '#fff' : '#334155', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            💼 Available Internships
          </button>
          
          <button 
            onClick={fetchTracker} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: activeTab === 'tracker' ? 'none' : '1px solid #cbd5e1', 
              background: activeTab === 'tracker' ? '#2563eb' : '#fff', 
              color: activeTab === 'tracker' ? '#fff' : '#334155', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            📊 My Applications Tracker
          </button>
        </div>

        {/* Available Internships View */}
        {activeTab === 'available' && (
          <div>
            {internships.length === 0 ? (
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                No internship opportunities posted yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {internships.map(i => (
                  <div key={i.internship_id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>{i.title}</h3>
                      <p style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>{i.company_name || 'Company'}</p>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Domain: {i.domain} • Stipend: ₹{i.stipend} / mo • Duration: {i.duration}</p>
                    </div>
                    <button onClick={() => handleApply(i.internship_id)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tracker View */}
        {activeTab === 'tracker' && (
          <div>
            {loadingTracker ? (
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                Loading your applications...
              </div>
            ) : myApplications.length === 0 ? (
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                You haven't applied to any internships yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {myApplications.map(app => (
                  <div key={app.application_id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>{app.title}</h3>
                      <p style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>{app.company_name}</p>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Domain: {app.domain} • Stipend: ₹{app.stipend} / mo</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Status:</span>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}