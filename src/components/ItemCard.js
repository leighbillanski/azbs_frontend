import React from 'react';

const ItemCard = ({ item, onClaim, showClaimButton = true, guestInfo = null }) => {
  return (
    <div className="item-card">
      {item.item_photo && (
        <img 
          src={item.item_photo} 
          alt={item.item_name} 
          className="item-photo"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="item-details">
        <h3>{item.item_name}</h3>
        <p className="item-count">Available: {(item.item_count || 0) - (item.claimed_count || 0)} of {item.item_count || 0}</p>
        {item.claimed && (
          <div className="claimed-badge">
            <span className="badge">Claimed</span>
            {guestInfo && (
              <p className="guest-info">
                By: {guestInfo.name} ({guestInfo.number})
              </p>
            )}
          </div>
        )}
        {!item.claimed && showClaimButton && onClaim && (
          <button 
            onClick={() => onClaim(item)} 
            className="btn btn-primary"
          >
            Claim Item
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
