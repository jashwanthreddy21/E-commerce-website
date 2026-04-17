import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, Mail, Phone, Hash } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    nickname: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        nickname: user.nickname || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.put('/auth/me', formData);
      setUser(res.data); // Update global context immediately
      setMessageType('success');
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="center-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div className="card animate-fade-in" style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <User size={32} style={{ color: 'var(--primary)' }} /> Profile Settings
        </h1>

        <div style={{ padding: '1rem', background: '#F1F5F9', borderRadius: 'var(--radius)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={30} />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{user.full_name || 'My Profile'}</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} /> {user.email}
            </p>
          </div>
        </div>

        {message && (
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', background: messageType === 'error' ? '#FEE2E2' : '#D1FAE5', color: messageType === 'error' ? '#991B1B' : '#065F46', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16}/> Full Name</label>
            <input 
              type="text" 
              name="full_name"
              className="form-control" 
              value={formData.full_name} 
              onChange={handleChange} 
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Hash size={16}/> Nickname</label>
            <input 
              type="text" 
              name="nickname"
              className="form-control" 
              value={formData.nickname} 
              onChange={handleChange} 
              placeholder="e.g. Johnny"
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={16}/> Phone Number</label>
            <input 
              type="text" 
              name="phone_number"
              className="form-control" 
              value={formData.phone_number} 
              onChange={handleChange} 
              placeholder="e.g. +1 (555) 000-0000"
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', borderRadius: '50px', padding: '1rem' }}>
              {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></div> : <><Save size={20} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
