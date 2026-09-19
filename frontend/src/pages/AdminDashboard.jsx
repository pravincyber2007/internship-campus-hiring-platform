import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function AdminDashboard({ isAuthenticated, userRole, onLogout }) {
  const [rosterData, setRosterData] = useState({ college_code: '', college_name: '', students: [], applications: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminRoster = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;
        const response = await API.get(`/admin/roster/${userId}`);
        setRosterData(response.data);
      } catch {
        setError("Could not load institutional roster data.");
      }
    };
    fetchAdminRoster();
  }, []);

  const groupedApplications = rosterData.applications.reduce((acc, app) => {
    const key = `${app.internship_title} (${app.company_name})`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(app);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={onLogout} />
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.3rem' }}>T&P Admin Portal</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Institutional student engagement and tracking system.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
            <div style={{ fontWeight: '600', color: '#0f172a' }}>🏛️ Institution: {rosterData.college_name || 'Loading...'}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              College Code: <span style={{ fontWeight: '600', color: '#dc2626' }}>{rosterData.college_code || 'N/A'}</span>
            </div>
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#0f172a' }}>Registered Students in Your Institution</h3>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Student Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>CGPA</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Core Skills</th>
              </tr>
            </thead>
            <tbody>
              {rosterData.students.length === 0 ? (
                <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No students registered under your institution code yet.</td></tr>
              ) : (
                rosterData.students.map((student) => (
                  <tr key={student.profile_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{student.name}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{student.cgpa || 'N/A'}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{student.skills || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#0f172a' }}>Internships & Registered College Students</h3>
        {Object.keys(groupedApplications).length === 0 ? (
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
            No internship applications submitted by your students yet.
          </div>
        ) : (
          Object.keys(groupedApplications).map((key) => (
            <div key={key} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f1f5f9', padding: '1rem 1.5rem', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>
                🎯 {key} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '400' }}>({groupedApplications[key].length} candidate(s))</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Student Name</th>
                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>CGPA</th>
                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Applied Date</th>
                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedApplications[key].map((app) => (
                    <tr key={app.application_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1.5rem', fontWeight: '500' }}>{app.student_name}</td>
                      <td style={{ padding: '0.75rem 1.5rem' }}>{app.student_cgpa}</td>
                      <td style={{ padding: '0.75rem 1.5rem', color: '#64748b' }}>{app.applied_date}</td>
                      <td style={{ padding: '0.75rem 1.5rem', fontWeight: '600', color: app.status === 'Accepted' ? '#16a34a' : app.status === 'Rejected' ? '#dc2626' : '#2563eb' }}>
                        {app.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

      </div>
    </div>
  );
}