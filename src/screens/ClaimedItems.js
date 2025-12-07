import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGuestsByUser, getAllItems } from '../api/api';
import ItemCard from '../components/ItemCard';

const ClaimedItems = () => {
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchClaimedItems();
  }, [user]);

  const fetchClaimedItems = async () => {
    try {
      const guestsResponse = await getGuestsByUser(user.email);
      
      if (guestsResponse.success) {
        const guests = guestsResponse.data;
        const itemsResponse = await getAllItems();
        
        if (itemsResponse.success) {
          const allItems = itemsResponse.data;
          const userClaimedItems = allItems.filter((item) =>
            item.claimed &&
            guests.some(
              (guest) =>
                guest.name === item.guest_name &&
                guest.number === item.guest_number
            )
          );
          
          const itemsWithGuestInfo = userClaimedItems.map((item) => {
            const guest = guests.find(
              (g) => g.name === item.guest_name && g.number === item.guest_number
            );
            return {
              ...item,
              guestInfo: guest,
            };
          });
          
          setClaimedItems(itemsWithGuestInfo);
        }
      }
    } catch (err) {
      setError('Failed to load claimed items');
      console.error('Error fetching claimed items:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading claimed items...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="screen-container">
      <h1>Claimed Items by Your Guests</h1>
      <p className="subtitle">
        Items claimed by guests you created
      </p>
      <div className="items-grid">
        {claimedItems.length === 0 ? (
          <p>No items claimed by your guests yet</p>
        ) : (
          claimedItems.map((item) => (
            <ItemCard
              key={item.item_name}
              item={item}
              showClaimButton={false}
              guestInfo={item.guestInfo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ClaimedItems;
