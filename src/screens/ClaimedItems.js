import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGuestsByUser, getAllItems, getClaimsByGuest, updateClaim, deleteClaim } from '../api/api';

const ClaimedItems = () => {
  const [guestsWithClaims, setGuestsWithClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingClaim, setEditingClaim] = useState(null); // { guestName, guestNumber, itemName, currentQty, maxAvailable }
  const [newQuantity, setNewQuantity] = useState(1);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  const fetchGuestsAndClaims = useCallback(async () => {
    try {
      // Get all guests for the logged-in user
      const guestsResponse = await getGuestsByUser(user.email);
      
      if (guestsResponse.success) {
        const guests = guestsResponse.data;
        
        // Get all items to enrich claim data
        const itemsResponse = await getAllItems();
        const allItems = itemsResponse.success ? itemsResponse.data : [];
        
        // For each guest, fetch their claims
        const guestsWithClaimsData = await Promise.all(
          guests.map(async (guest) => {
            try {
              const claimsResponse = await getClaimsByGuest(guest.name, guest.number);
              
              console.log('Claims response for', guest.name, ':', claimsResponse);
              
              if (claimsResponse.success && claimsResponse.data.length > 0) {
                // Enrich claims with full item data
                const enrichedClaims = claimsResponse.data.map(claim => {
                  console.log('Claim data:', claim);
                  const itemDetails = allItems.find(item => item.item_name === claim.item_name);
                  return {
                    ...claim,
                    item_photo: itemDetails?.item_photo,
                    item_link: itemDetails?.item_link,
                    item_count: itemDetails?.item_count,
                    claimed_count: itemDetails?.claimed_count
                  };
                });
                
                console.log('Enriched claims:', enrichedClaims);
                
                // Calculate total quantity - handle different possible field names
                const totalQuantity = enrichedClaims.reduce((sum, claim) => {
                  const qty = claim.quantity_claimed || claim.quantity || claim.claim_quantity || claim.qty || 1;
                  console.log('Claim quantity for', claim.item_name, ':', qty, 'raw claim:', claim);
                  return sum + qty;
                }, 0);
                
                console.log('Total quantity for guest', guest.name, ':', totalQuantity);
                
                return {
                  ...guest,
                  claims: enrichedClaims,
                  totalQuantity: totalQuantity
                };
              }
              
              return null; // Guest has no claims
            } catch (err) {
              console.error(`Error fetching claims for guest ${guest.name}:`, err);
              return null;
            }
          })
        );
        
        // Filter out guests with no claims
        const guestsWithValidClaims = guestsWithClaimsData.filter(guest => guest !== null);
        setGuestsWithClaims(guestsWithValidClaims);
      }
    } catch (err) {
      setError('Failed to load claimed items');
      console.error('Error fetching guests and claims:', err);
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    fetchGuestsAndClaims();
  }, [fetchGuestsAndClaims]);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getTotalStats = () => {
    const totalGuests = guestsWithClaims.length;
    const totalItems = guestsWithClaims.reduce((sum, guest) => sum + guest.claims.length, 0);
    const totalQuantity = guestsWithClaims.reduce((sum, guest) => sum + guest.totalQuantity, 0);
    return { totalGuests, totalItems, totalQuantity };
  };

  const handleEditClaim = (guestName, guestNumber, itemName, currentQty, itemCount, claimedCount) => {
    // Calculate max available: current claim + remaining available
    // remaining available = item_count - claimed_count
    const remainingAvailable = (itemCount || 0) - (claimedCount || 0);
    const maxAvailable = currentQty + remainingAvailable;
    
    setEditingClaim({ guestName, guestNumber, itemName, currentQty, maxAvailable });
    setNewQuantity(currentQty);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingClaim(null);
    setNewQuantity(1);
    setError('');
  };

  const handleSaveQuantity = async () => {
    if (!editingClaim || updating) return;
    
    if (newQuantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    if (newQuantity > editingClaim.maxAvailable) {
      setError(`Quantity cannot exceed ${editingClaim.maxAvailable} (maximum available)`);
      return;
    }

    setUpdating(true);
    try {
      console.log('Updating claim:', {
        guestName: editingClaim.guestName,
        guestNumber: editingClaim.guestNumber,
        itemName: editingClaim.itemName,
        newQuantity: newQuantity
      });
      
      const response = await updateClaim(
        editingClaim.guestName,
        editingClaim.guestNumber,
        editingClaim.itemName,
        { quantity: newQuantity }
      );

      console.log('Update response:', response);

      if (response.success) {
        setSuccess(`Updated quantity for ${editingClaim.itemName} to ${newQuantity}`);
        setEditingClaim(null);
        setNewQuantity(1);
        // Clear existing data and refresh to ensure recalculation
        setGuestsWithClaims([]);
        await fetchGuestsAndClaims();
      } else {
        console.error('Update failed:', response);
        setError(response?.error || 'Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating claim:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.error || 'Failed to update quantity. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUnclaimItem = async (guestName, guestNumber, itemName) => {
    if (updating) return;
    
    if (!window.confirm(`Are you sure you want to unclaim "${itemName}"?`)) {
      return;
    }

    setUpdating(true);
    try {
      const response = await deleteClaim(guestName, guestNumber, itemName);

      if (response.success) {
        setSuccess(`Successfully unclaimed "${itemName}"`);
        // Clear existing data and refresh to ensure recalculation
        setGuestsWithClaims([]);
        await fetchGuestsAndClaims();
      } else {
        setError(response?.error || 'Failed to unclaim item');
      }
    } catch (err) {
      console.error('Error unclaiming item:', err);
      setError('Failed to unclaim item. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading claimed items...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const stats = getTotalStats();

  return (
    <div className="screen-container">
      <div className="claimed-header">
        <h1>Claimed Items</h1>
        <p className="subtitle">
          Items claimed by guests you've added
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {guestsWithClaims.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h2>No Claims Yet</h2>
          <p>Your guests haven't claimed any items yet. Head to the RSVP page to start claiming!</p>
        </div>
      ) : (
        <>
          <div className="claimed-summary">
            <div className="summary-stat">
              <span className="stat-label">Guests</span>
              <span className="stat-value">{stats.totalGuests}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Products</span>
              <span className="stat-value">{stats.totalItems}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Total Items</span>
              <span className="stat-value">{stats.totalQuantity}</span>
            </div>
          </div>

          <div className="guests-list">
            {guestsWithClaims.map((guest) => (
              <div key={`${guest.name}-${guest.number}`} className="guest-card">
                <div className="guest-card-header">
                  <div className="guest-avatar">
                    {getInitials(guest.name)}
                  </div>
                  <div className="guest-info">
                    <h3>{guest.name}</h3>
                    <span className="guest-claim-badge">
                      {guest.claims.length} product{guest.claims.length !== 1 ? 's' : ''} • {guest.totalQuantity} item{guest.totalQuantity !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="guest-claimed-items">
                  <h4>Claimed Items:</h4>
                  <ul className="claimed-items-simple-list">
                    {guest.claims.map((claim) => {
                      const qty = claim.quantity_claimed || claim.quantity || claim.claim_quantity || claim.qty || 1;
                      const isEditing = editingClaim?.guestName === guest.name && 
                                       editingClaim?.guestNumber === guest.number && 
                                       editingClaim?.itemName === claim.item_name;
                      
                      return (
                        <li key={claim.item_name}>
                          <span className="claim-item-name">{claim.item_name}</span>
                          
                          {isEditing ? (
                            <div className="claim-edit-controls">
                              <input
                                type="number"
                                min="1"
                                max={editingClaim.maxAvailable}
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
                                className="claim-quantity-input"
                                title={`Max available: ${editingClaim.maxAvailable}`}
                              />
                              <span className="claim-max-hint">/ {editingClaim.maxAvailable}</span>
                              <button
                                onClick={handleSaveQuantity}
                                className="btn-icon btn-save"
                                title="Save"
                                disabled={updating}
                              >
                                {updating ? '⏳' : '✓'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="btn-icon btn-cancel"
                                title="Cancel"
                                disabled={updating}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="claim-actions">
                              <span className="claim-quantity">× {qty}</span>
                              <button
                                onClick={() => handleEditClaim(guest.name, guest.number, claim.item_name, qty, claim.item_count, claim.claimed_count)}
                                className="btn-icon btn-edit"
                                title="Edit quantity"
                                disabled={updating}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleUnclaimItem(guest.name, guest.number, claim.item_name)}
                                className="btn-icon btn-delete"
                                title="Unclaim item"
                                disabled={updating}
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClaimedItems;
