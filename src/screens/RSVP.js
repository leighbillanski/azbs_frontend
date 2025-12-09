import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUnclaimedItems, claimItem } from '../api/api';

const RSVP = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimingFor, setClaimingFor] = useState('self'); // 'self' or 'guest'
  const [guestData, setGuestData] = useState({
    name: '',
    number: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUnclaimedItems();
      if (response && response.success) {
        setItems(response.data || []);
      } else {
        setError('Failed to load items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setError('');
    setSuccess('');
    // Reset form
    setClaimingFor('self');
    setGuestData({ name: '', number: '' });
  };

  const handleGuestDataChange = (e) => {
    setGuestData({
      ...guestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedItem) {
      setError('Please select an item to claim');
      return;
    }

    // Validate guest data if claiming for guest
    if (claimingFor === 'guest') {
      if (!guestData.name.trim()) {
        setError('Guest name is required');
        return;
      }
      if (!guestData.number.trim()) {
        setError('Guest contact number is required');
        return;
      }
    }

    setSubmitting(true);

    try {
      const claimData = claimingFor === 'self' 
        ? {
            name: user.name,
            number: user.email, // Using email as identifier
            userEmail: user.email,
          }
        : {
            name: guestData.name,
            number: guestData.number,
            userEmail: user.email, // Track who added the guest
          };

      const response = await claimItem(selectedItem.item_name, claimData);
      
      if (response && response.success) {
        setSuccess(`Successfully claimed "${selectedItem.item_name}" for ${claimingFor === 'self' ? 'yourself' : guestData.name}!`);
        setSelectedItem(null);
        setGuestData({ name: '', number: '' });
        setClaimingFor('self');
        // Refresh items list
        fetchItems();
      } else {
        setError(response?.error || 'Failed to claim item');
      }
    } catch (err) {
      console.error('Error claiming item:', err);
      setError('Failed to claim item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setError('');
    setSuccess('');
    setGuestData({ name: '', number: '' });
    setClaimingFor('self');
  };

  return (
    <div className="screen-container">
      <div className="rsvp-header">
        <h1>RSVP & Claim Items</h1>
        <p className="subtitle">Let us know you're coming and claim items you'd like to bring</p>
      </div>

      {success && (
        <div className="success-message-banner">
          ✓ {success}
        </div>
      )}

      <div className="rsvp-container">
        {/* Available Items Section */}
        <div className="rsvp-items-section">
          <h2>Available Items</h2>
          {loading ? (
            <div className="loading">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="no-items-message">
              <span className="no-items-icon">🎁</span>
              <p>All items have been claimed! Thank you for your interest.</p>
            </div>
          ) : (
            <div className="rsvp-items-grid">
              {items.map((item) => (
                <div 
                  key={item.item_name} 
                  className={`rsvp-item-card ${selectedItem?.item_name === item.item_name ? 'selected' : ''}`}
                  onClick={() => handleItemSelect(item)}
                >
                  {item.item_photo && (
                    <img 
                      src={item.item_photo} 
                      alt={item.item_name}
                      className="rsvp-item-image"
                    />
                  )}
                  <div className="rsvp-item-content">
                    <h3>{item.item_name}</h3>
                    {item.item_link && (
                      <a 
                        href={item.item_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details 🔗
                      </a>
                    )}
                    <div className="item-quantity">
                      Quantity needed: {item.item_count || 1}
                    </div>
                    {selectedItem?.item_name === item.item_name && (
                      <div className="selected-badge">✓ Selected</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claim Form Section */}
        {selectedItem && (
          <div className="rsvp-claim-section">
          <div className="rsvp-claim-card">
          <h2>Claim "{selectedItem.item_name}"</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Claiming For Selection */}
                <div className="claiming-for-section">
                  <label className="section-label">Who are you claiming this for?</label>
                  <div className="claiming-options">
                    <label className={`claiming-option ${claimingFor === 'self' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="claimingFor"
                        value="self"
                        checked={claimingFor === 'self'}
                        onChange={(e) => setClaimingFor(e.target.value)}
                      />
                      <div className="option-content">
                        <span className="option-icon">👤</span>
                        <div>
                          <strong>Myself</strong>
                          <p>I will bring this item</p>
                        </div>
                      </div>
                    </label>

                    <label className={`claiming-option ${claimingFor === 'guest' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="claimingFor"
                        value="guest"
                        checked={claimingFor === 'guest'}
                        onChange={(e) => setClaimingFor(e.target.value)}
                      />
                      <div className="option-content">
                        <span className="option-icon">👥</span>
                        <div>
                          <strong>A Guest</strong>
                          <p>Someone else will bring this</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Guest Information Form */}
                {claimingFor === 'guest' && (
                  <div className="guest-form-section">
                    <h3>Guest Information</h3>
                    <div className="form-group">
                      <label htmlFor="guestName">Guest Name *</label>
                      <input
                        type="text"
                        id="guestName"
                        name="name"
                        value={guestData.name}
                        onChange={handleGuestDataChange}
                        required
                        placeholder="Enter guest's full name"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="guestNumber">Contact Number *</label>
                      <input
                        type="text"
                        id="guestNumber"
                        name="number"
                        value={guestData.number}
                        onChange={handleGuestDataChange}
                        required
                        placeholder="Guest's phone or contact number"
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {/* Confirmation Section */}
                <div className="claim-summary">
                  <h4>Summary</h4>
                  <div className="summary-row">
                    <span>Item:</span>
                    <strong>{selectedItem.item_name}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Claimed by:</span>
                    <strong>
                      {claimingFor === 'self' 
                        ? user.name 
                        : guestData.name || 'Guest (enter details above)'}
                    </strong>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Claiming...' : '✓ Confirm Claim'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancel}
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
    </div>
  );
};

export default RSVP;

