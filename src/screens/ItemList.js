import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllItems, claimItem } from '../api/api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // Object: { itemName: quantity }
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimingFor, setClaimingFor] = useState('self'); // 'self' or 'guest'
  const [guestData, setGuestData] = useState({ name: '', number: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getAllItems();
      if (response.success) {
        setItems(response.data);
      }
    } catch (err) {
      setError('Failed to load items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (itemName, maxQuantity) => {
    setSelectedItems(prev => {
      const newSelection = { ...prev };
      if (newSelection[itemName]) {
        // Remove from selection
        delete newSelection[itemName];
      } else {
        // Add to selection with quantity 1
        newSelection[itemName] = 1;
      }
      return newSelection;
    });
    setError('');
    setSuccess('');
  };

  const handleQuantityChange = (itemName, quantity, maxQuantity) => {
    const qty = parseInt(quantity) || 0;
    if (qty < 1) return;
    if (qty > maxQuantity) return;
    
    setSelectedItems(prev => ({
      ...prev,
      [itemName]: qty
    }));
  };

  const handleShowClaimModal = () => {
    if (Object.keys(selectedItems).length === 0) {
      setError('Please select at least one item');
      return;
    }
    setShowClaimModal(true);
    setError('');
    setSuccess('');
  };

  const handleGuestDataChange = (e) => {
    setGuestData({
      ...guestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (Object.keys(selectedItems).length === 0) {
      setError('Please select at least one item to claim');
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

    // Claim all selected items with their quantities
    const results = [];
    const failures = [];
    let totalItemsClaimed = 0;

    for (const [itemName, quantity] of Object.entries(selectedItems)) {
      try {
        // Create a claim data with quantity
        const claimDataWithQty = {
          ...claimData,
          quantity: quantity
        };
        
        const response = await claimItem(itemName, claimDataWithQty);
        if (response && response.success) {
          results.push({ name: itemName, quantity });
          totalItemsClaimed += quantity;
        } else {
          failures.push({ name: itemName, quantity, error: response?.error || 'Unknown error' });
        }
      } catch (err) {
        failures.push({ name: itemName, quantity, error: err.message });
      }
    }

    setSubmitting(false);

    // Show results
    if (failures.length === 0) {
      setSuccess(`Successfully claimed ${totalItemsClaimed} item(s) across ${results.length} product(s) for ${claimingFor === 'self' ? 'yourself' : guestData.name}!`);
      setSelectedItems({});
      setShowClaimModal(false);
      setGuestData({ name: '', number: '' });
      setClaimingFor('self');
      // Refresh items list
      fetchItems();
    } else if (results.length === 0) {
      setError('Failed to claim any items. Please try again.');
    } else {
      setSuccess(`Claimed ${results.length} product(s). ${failures.length} failed.`);
      setError(`Failed items: ${failures.map(f => f.name).join(', ')}`);
      // Keep only failed items selected
      const failedItems = {};
      failures.forEach(f => {
        failedItems[f.name] = f.quantity;
      });
      setSelectedItems(failedItems);
      // Refresh items list
      fetchItems();
    }
  };

  const handleCancelClaim = () => {
    setShowClaimModal(false);
    setClaimingFor('self');
    setGuestData({ name: '', number: '' });
    setError('');
    setSuccess('');
  };

  const getSelectedItemsCount = () => {
    return Object.keys(selectedItems).length;
  };

  const getTotalQuantity = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  if (loading) return <div className="loading">Loading items...</div>;

  const unclaimedItems = items.filter(item => !item.claimed);

  return (
    <div className="screen-container">
      <div className="items-list-header">
        <div>
          <h1>Available Items</h1>
          <p className="subtitle">Select items and quantities to claim for the baby shower</p>
        </div>
        {getSelectedItemsCount() > 0 && (
          <button 
            className="btn btn-primary btn-large"
            onClick={handleShowClaimModal}
          >
            Claim {getTotalQuantity()} Item{getTotalQuantity() > 1 ? 's' : ''} ({getSelectedItemsCount()} product{getSelectedItemsCount() > 1 ? 's' : ''})
          </button>
        )}
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {getSelectedItemsCount() > 0 && (
        <div className="selection-info">
          ✓ {getSelectedItemsCount()} product{getSelectedItemsCount() > 1 ? 's' : ''} selected ({getTotalQuantity()} total items)
        </div>
      )}

      <div className="items-list-container">
        {unclaimedItems.length === 0 ? (
          <div className="no-items-message">
            <span className="no-items-icon">🎁</span>
            <p>No unclaimed items available at the moment</p>
          </div>
        ) : (
          <div className="items-list">
            {unclaimedItems.map((item) => (
              <div 
                key={item.item_name} 
                className={`item-list-row ${selectedItems[item.item_name] ? 'selected' : ''}`}
              >
                <div className="item-checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.item_name]}
                    onChange={() => handleCheckboxChange(item.item_name, item.item_count)}
                    className="item-checkbox"
                  />
                </div>
                
                {item.item_photo && (
                  <img 
                    src={item.item_photo} 
                    alt={item.item_name}
                    className="item-list-thumbnail"
                  />
                )}
                
                <div className="item-list-info">
                  <h3>{item.item_name}</h3>
                  <div className="item-meta">
                    <span className="item-quantity">Available: {item.item_count || 1}</span>
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
                  </div>
                </div>

                {selectedItems[item.item_name] && (
                  <div className="quantity-selector">
                    <label htmlFor={`qty-${item.item_name}`}>Quantity:</label>
                    <input
                      id={`qty-${item.item_name}`}
                      type="number"
                      min="1"
                      max={item.item_count || 1}
                      value={selectedItems[item.item_name]}
                      onChange={(e) => handleQuantityChange(item.item_name, e.target.value, item.item_count)}
                      className="quantity-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="quantity-max">of {item.item_count}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showClaimModal && (
        <div className="modal-overlay" onClick={handleCancelClaim}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Claim {getTotalQuantity()} Item{getTotalQuantity() > 1 ? 's' : ''}</h2>
            
            <form onSubmit={handleClaimSubmit}>
              {/* Claiming For Selection */}
              <div className="claiming-for-section">
                <label className="section-label">Who are you claiming for?</label>
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
                        <p>I will bring these items</p>
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
                        <p>Someone else will bring these</p>
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

              {/* Summary Section */}
              <div className="claim-summary">
                <h4>Summary</h4>
                <div className="summary-items-list">
                  <strong>Selected Items:</strong>
                  <ul>
                    {Object.entries(selectedItems).map(([itemName, quantity]) => (
                      <li key={itemName}>
                        <span className="summary-item-name">{itemName}</span>
                        <span className="summary-item-qty">× {quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="summary-total">
                    <strong>Total: {getTotalQuantity()} items</strong>
                  </div>
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

              <div className="modal-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Claiming...' : `✓ Confirm Claim (${getTotalQuantity()} item${getTotalQuantity() > 1 ? 's' : ''})`}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelClaim}
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

export default ItemList;
