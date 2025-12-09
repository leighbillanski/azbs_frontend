import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGuestsByUser, createGuest, updateGuest } from '../api/api';

const RSVP = () => {
  const { user } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState({}); // { guestKey: 'going' | 'not-going' }
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuestData, setNewGuestData] = useState({
    name: '',
    number: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getGuestsByUser(user.email);
      if (response.success) {
        const guestList = response.data || [];
        setGuests(guestList);
        
        // Initialize RSVP status from backend data
        const initialStatus = {};
        guestList.forEach(guest => {
          const key = `${guest.name}-${guest.number}`;
          // Backend uses 'going' boolean field: true = going, false = not-going
          initialStatus[key] = guest.going ? 'going' : 'not-going';
          console.log(`Guest ${guest.name}: going = ${guest.going}, status = ${initialStatus[key]}`);
        });
        setRsvpStatus(initialStatus);
      } else {
        setError('Failed to load guests');
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError('Failed to load guests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpChange = async (guestName, guestNumber, status) => {
    const key = `${guestName}-${guestNumber}`;
    
    console.log('=== RSVP UPDATE ===');
    console.log('Guest Name:', guestName);
    console.log('Guest Number:', guestNumber);
    console.log('New Status:', status);
    console.log('Encoded Name:', encodeURIComponent(guestName));
    console.log('Encoded Number:', encodeURIComponent(guestNumber));
    
    // Optimistically update UI
    setRsvpStatus(prev => ({
      ...prev,
      [key]: status
    }));
    
    try {
      // Backend expects 'going' boolean field: true = going, false = not-going
      const updateData = {
        going: status === 'going'
      };
      console.log('Update payload:', updateData);
      
      const response = await updateGuest(guestName, guestNumber, updateData);

      console.log('Update guest response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));

      if (response.success) {
        setSuccess(`Updated RSVP for ${guestName}: ${status === 'going' ? 'Going' : 'Not Going'}`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('Update failed:', response);
        // Revert on failure
        setRsvpStatus(prev => ({
          ...prev,
          [key]: status === 'going' ? 'not-going' : 'going'
        }));
        setError(response?.error || 'Failed to update RSVP');
      }
    } catch (err) {
      console.error('Error updating RSVP:', err);
      console.error('Error response:', err.response);
      // Revert on error
      setRsvpStatus(prev => ({
        ...prev,
        [key]: status === 'going' ? 'not-going' : 'going'
      }));
      setError(err.response?.data?.error || 'Failed to update RSVP. Please try again.');
    }
  };

  const handleAddGuestClick = () => {
    setShowAddGuest(true);
    setError('');
    setSuccess('');
  };

  const handleCancelAddGuest = () => {
    setShowAddGuest(false);
    setNewGuestData({ name: '', number: '' });
    setError('');
  };

  const handleNewGuestChange = (e) => {
    setNewGuestData({
      ...newGuestData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    
    if (!newGuestData.name.trim()) {
      setError('Guest name is required');
      return;
    }
    
    if (!newGuestData.number.trim()) {
      setError('Phone number is required');
      return;
    }

    // Check if guest already exists
    const existingGuest = guests.find(
      g => g.name.toLowerCase() === newGuestData.name.trim().toLowerCase() || 
           g.number === newGuestData.number.trim()
    );
    
    if (existingGuest) {
      setError(`A guest with this ${existingGuest.name.toLowerCase() === newGuestData.name.trim().toLowerCase() ? 'name' : 'number'} already exists.`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await createGuest({
        name: newGuestData.name.trim(),
        number: newGuestData.number.trim(),
        user_email: user.email
      });

      if (response.success) {
        setSuccess(`Guest "${newGuestData.name}" added successfully!`);
        setShowAddGuest(false);
        setNewGuestData({ name: '', number: '' });
        // Refresh guest list
        fetchGuests();
      } else {
        setError(response?.error || 'Failed to add guest');
      }
    } catch (err) {
      console.error('Error adding guest:', err);
      setError('Failed to add guest. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStats = () => {
    const totalGuests = guests.length;
    const going = Object.values(rsvpStatus).filter(status => status === 'going').length;
    const notGoing = Object.values(rsvpStatus).filter(status => status === 'not-going').length;
    return { totalGuests, going, notGoing };
  };

  if (loading) return <div className="loading">Loading guests...</div>;

  const stats = getStats();

  return (
    <div className="screen-container">
      <div className="rsvp-header">
        <h1>RSVP</h1>
        <p className="subtitle">Manage your guest list and RSVPs</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {guests.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <h2>No Guests Yet</h2>
          <p>Add guests to your list to manage RSVPs</p>
          <button onClick={handleAddGuestClick} className="btn btn-primary">
            Add Your First Guest
          </button>
        </div>
      ) : (
        <>
          <div className="rsvp-summary">
            <div className="summary-stat">
              <span className="stat-label">Total Guests</span>
              <span className="stat-value">{stats.totalGuests}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Going</span>
              <span className="stat-value stat-going">{stats.going}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Not Going</span>
              <span className="stat-value stat-not-going">{stats.notGoing}</span>
            </div>
          </div>

          <div className="rsvp-actions-bar">
            <button onClick={handleAddGuestClick} className="btn btn-primary">
              ➕ Add Guest
            </button>
          </div>

          <div className="rsvp-guests-list">
            {guests.map((guest) => {
              const key = `${guest.name}-${guest.number}`;
              const status = rsvpStatus[key] || 'not-going';
              
              return (
                <div key={key} className="rsvp-guest-card">
                  <div className="guest-info-section">
                    <div className="guest-avatar-small">
                      {getInitials(guest.name)}
                    </div>
                    <div className="guest-details">
                      <h3>{guest.name}</h3>
                      <p className="guest-number">📞 {guest.number}</p>
                    </div>
                  </div>

                  <div className="rsvp-radio-group">
                    <label className={`rsvp-radio-option ${status === 'going' ? 'active going' : ''}`}>
                      <input
                        type="radio"
                        name={`rsvp-${key}`}
                        value="going"
                        checked={status === 'going'}
                        onChange={() => handleRsvpChange(guest.name, guest.number, 'going')}
                      />
                      <span className="radio-label">✓ Going</span>
                    </label>

                    <label className={`rsvp-radio-option ${status === 'not-going' ? 'active not-going' : ''}`}>
                      <input
                        type="radio"
                        name={`rsvp-${key}`}
                        value="not-going"
                        checked={status === 'not-going'}
                        onChange={() => handleRsvpChange(guest.name, guest.number, 'not-going')}
                      />
                      <span className="radio-label">✕ Not Going</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add Guest Modal */}
      {showAddGuest && (
        <div className="modal-overlay" onClick={handleCancelAddGuest}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Guest</h2>
            
            <form onSubmit={handleAddGuest}>
              <div className="form-group">
                <label htmlFor="guestName">Guest Name *</label>
                <input
                  type="text"
                  id="guestName"
                  name="name"
                  value={newGuestData.name}
                  onChange={handleNewGuestChange}
                  required
                  placeholder="Enter guest's full name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="guestNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="guestNumber"
                  name="number"
                  value={newGuestData.number}
                  onChange={handleNewGuestChange}
                  required
                  placeholder="Enter guest's phone number"
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Guest'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelAddGuest}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RSVP;
