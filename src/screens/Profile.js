import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../api/api';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    role: 'guest',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        number: user.number || '',
        password: user.password || '',
        role: user.role || 'guest',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.number.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('=== PROFILE UPDATE ===');
      console.log('User email:', user.email);
      console.log('Update data:', formData);
      
      // Use the update endpoint with user's email
      const response = await updateUser(user.email, formData);
      
      console.log('Update response:', response);
      
      if (response && response.success) {
        // Update the context with new user data
        login(response.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response?.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('=== PROFILE UPDATE ERROR ===');
      console.error('Error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        role: user.role || 'user',
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="screen-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p className="subtitle">View and manage your account information</p>
      </div>

      <div className="profile-container">
        {/* Profile Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {getInitials(user?.name)}
          </div>
          <h2>{user?.name || 'User'}</h2>
          <p className="profile-email">{user?.email}</p>
        </div>

        {/* Profile Details Card */}
        <div className="profile-card">
          {!isEditing ? (
            <>
              <div className="profile-header-actions">
                <h3>Profile Information</h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              </div>

              <div className="profile-details-grid">
                <div className="profile-detail-item">
                  <label>Full Name</label>
                  <p>{user?.name || 'Not provided'}</p>
                </div>

                <div className="profile-detail-item">
                  <label>Email Address</label>
                  <p>{user?.email || 'Not provided'}</p>
                </div>

                <div className="profile-detail-item">
                  <label>Phone Number</label>
                  <p>{user?.number || 'Not provided'}</p>
                </div>

                <div className="profile-detail-item">
                  <label>Account Type</label>
                  <p style={{ textTransform: 'capitalize' }}>{user?.role || 'User'}</p>
                </div>

                <div className="profile-detail-item">
                  <label>Password</label>
                  <p>••••••••</p>
                </div>
              </div>

              {success && <div className="success-message">{success}</div>}
            </>
          ) : (
            <>
              <h3>Edit Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="number">Phone Number *</label>
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="form-input"
                    minLength="6"
                  />
                  <small className="form-help">Minimum 6 characters</small>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Account Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h4>Account Status</h4>
              <p className="stat-value">Active</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <h4>Security</h4>
              <p className="stat-value">Protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

