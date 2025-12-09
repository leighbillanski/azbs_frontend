import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    number: '',
    password: '',
    role: 'guest',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const testConnection = async () => {
    console.log('Testing backend connection...');
    try {
      const response = await fetch('https://azbs-backend.onrender.com/api/users');
      const data = await response.json();
      console.log('Backend connection test:', data);
      alert('Backend is reachable! Check console for details.');
    } catch (err) {
      console.error('Backend connection test failed:', err);
      alert('Backend connection failed! Check console for details.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Form Data:', formData);

    try {
      console.log('Calling registerUser API...');
      const response = await registerUser(formData);
      console.log('Registration response:', response);
      console.log('Response type:', typeof response);
      console.log('Response success:', response?.success);
      console.log('Response data:', response?.data);
      
      if (response && response.success) {
        console.log('Registration successful! Logging in user...');
        login(response.data);
        navigate('/');
      } else {
        console.error('Registration failed - response not successful');
        setError(response?.error || 'Registration failed. Email may already exist.');
      }
    } catch (err) {
      console.error('=== REGISTRATION ERROR ===');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 409) {
        setError('This email is already registered. Please login instead.');
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Registration failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
      console.log('=== REGISTRATION ATTEMPT COMPLETE ===');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="number">Phone Number</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Enter your password (min 6 characters)"
              className="form-input"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        <button 
          type="button" 
          onClick={testConnection}
          style={{ marginTop: '10px', fontSize: '12px', padding: '5px' }}
        >
          Test Backend Connection
        </button>
      </div>
    </div>
  );
};

export default Register;
