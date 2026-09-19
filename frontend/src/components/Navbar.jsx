import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Navbar({ isAuthenticated, userRole, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [profileData, setProfileData] = useState({ name: '', college_name: '', college_code: '', cgpa: '', skills: '', industry: '' });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/');
    }
  };

  const fetchProfileDetails = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      let endpoint = '';
      if (userRole === 'student') endpoint = `/profiles/student/user/${userId}`;
      else if (userRole === 'company') endpoint = `/profiles/company/user/${userId}`;
      else if (userRole === 'admin') endpoint = `/profiles/admin/user/${userId}`;

      const res = await API.get(endpoint);
      setProfileData(res.data);
      setShowProfileModal(true);
    } catch {
      alert("Could not load profile details.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('user_id');
      let endpoint = '';
      if (userRole === 'student') endpoint = `/profiles/student/user/${userId}`;
      else if (userRole === 'company') endpoint = `/profiles/company/user/${userId}`;
      else if (userRole === 'admin') endpoint = `/profiles/admin/user/${userId}`;

      await API.put(endpoint, profileData);
      alert("Profile updated successfully!");
      setShowProfileModal(false);
      window.location.reload();
    } catch {
      alert("Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      await API.delete(`/profiles/user/${userId}`);
      onLogout();
    } catch {
      alert("Failed to delete account.");
    }
  };

  const handleDashboardRedirect = () => {
    setDropdownOpen(false);
    if (userRole === 'student') navigate('/student/dashboard');
    else if (userRole === 'company') navigate('/company/dashboard');
    else if (userRole === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2563eb', cursor: 'pointer' }} onClick={handleHomeClick}>
        🚀 CampusHire
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Home link ONLY shows on the public/landing page when not authenticated */}
        {!isAuthenticated && (
          <span onClick={handleHomeClick} style={{ textDecoration: 'none', color: '#475569', fontWeight: '500', cursor: 'pointer' }}>Home</span>
        )}
        
        {isAuthenticated && userRole === 'company' && (
          <Link to="/company/dashboard" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500' }}>Recruiter Portal</Link>
        )}
        {isAuthenticated && userRole === 'student' && (
          <Link to="/student/dashboard" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500' }}>Student Dashboard</Link>
        )}
        {isAuthenticated && userRole === 'admin' && (
          <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500' }}>T&P Portal</Link>
        )}

        {!isAuthenticated ? (
          <Link to="/auth" style={{ background: '#2563eb', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
        ) : (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#334155', cursor: 'pointer', border: '2px solid #cbd5e1' }}
            >
              👤
            </div>

            {dropdownOpen && (
              <div style={{ position: 'absolute', right: 0, top: '50px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '185px', zIndex: 100, overflow: 'hidden' }}>
                <div onClick={handleDashboardRedirect} style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>
                  📊 Dashboard
                </div>
                <div onClick={() => { setDropdownOpen(false); fetchProfileDetails(); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>
                  ⚙️ Profile Update
                </div>
                <div onClick={() => { setDropdownOpen(false); onLogout(); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', borderBottom: '1px solid #f1f5f9', fontWeight: '500' }}>
                  🚪 Logout
                </div>
                <div onClick={() => { setDropdownOpen(false); setShowDeleteModal(true); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#dc2626', fontWeight: '600' }}>
                  🗑️ Delete Account
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Update Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ marginBottom: '1.25rem', color: '#0f172a' }}>Update Profile Details</h3>
            <form onSubmit={handleUpdateProfile}>
              {userRole !== 'admin' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Name / Company Name</label>
                  <input type="text" value={profileData.name || ''} onChange={(e) => setProfileData({...profileData, name: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                </div>
              )}

              {userRole === 'student' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>College Name</label>
                    <input type="text" value={profileData.college_name || ''} onChange={(e) => setProfileData({...profileData, college_name: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>College Code</label>
                    <input type="text" value={profileData.college_code || ''} onChange={(e) => setProfileData({...profileData, college_code: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>CGPA</label>
                    <input type="number" step="0.01" value={profileData.cgpa || ''} onChange={(e) => setProfileData({...profileData, cgpa: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Skills</label>
                    <input type="text" value={profileData.skills || ''} onChange={(e) => setProfileData({...profileData, skills: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                </>
              )}

              {userRole === 'company' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Industry</label>
                  <input type="text" value={profileData.industry || ''} onChange={(e) => setProfileData({...profileData, industry: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              )}

              {userRole === 'admin' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Institution / College Name</label>
                    <input type="text" value={profileData.college_name || ''} onChange={(e) => setProfileData({...profileData, college_name: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>College Code</label>
                    <input type="text" value={profileData.college_code || ''} onChange={(e) => setProfileData({...profileData, college_code: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowProfileModal(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Do you really want to delete this account?</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This action is permanent and will wipe all associated records.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>No</button>
              <button onClick={handleDeleteAccount} style={{ padding: '0.6rem 1.25rem', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}