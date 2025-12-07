import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllItems, claimItem, createGuest } from '../api/api';
import ItemCard from '../components/ItemCard';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [guestData, setGuestData] = useState({ name: '', number: '' });
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

  const handleClaimClick = (item) => {
    setSelectedItem(item);
    setShowClaimModal(true);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      try {
        await createGuest({
          name: guestData.name,
          number: guestData.number,
          user_email: user.email,
          claimed_item: selectedItem.item_name,
        });
      } catch (err) {
        console.log('Guest creation error (may already exist):', err);
      }

      const response = await claimItem(selectedItem.item_name, {
        guest_name: guestData.name,
        guest_number: guestData.number,
      });

      if (response.success) {
        setShowClaimModal(false);
        setGuestData({ name: '', number: '' });
        fetchItems();
      }
    } catch (err) {
      alert('Failed to claim item. Please try again.');
      console.error('Claim error:', err);
    }
  };

  if (loading) return <div className="loading">Loading items...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="screen-container">
      <h1>Available Items</h1>
      <div className="items-grid">
        {items.length === 0 ? (
          <p>No items available</p>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.item_name}
              item={item}
              onClaim={handleClaimClick}
              showClaimButton={!item.claimed}
            />
          ))
        )}
      </div>

      {showClaimModal && (
        <div className="modal-overlay" onClick={() => setShowClaimModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Claim Item: {selectedItem?.item_name}</h2>
            <form onSubmit={handleClaimSubmit}>
              <div className="form-group">
                <label htmlFor="guestName">Guest Name</label>
                <input
                  type="text"
                  id="guestName"
                  value={guestData.name}
                  onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="guestNumber">Guest Number</label>
                <input
                  type="text"
                  id="guestNumber"
                  value={guestData.number}
                  onChange={(e) => setGuestData({ ...guestData, number: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Claim
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowClaimModal(false)}
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
