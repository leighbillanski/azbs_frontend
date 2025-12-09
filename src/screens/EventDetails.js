import React from 'react';

const EventDetails = () => {
  const eventInfo = {
    date: '10 January 2026',
    venue: 'The Hamlet Country Lodge',
    latitude: -33.29382646436079,
    longitude: 19.327689011762864,
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${eventInfo.latitude},${eventInfo.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="screen-container">
      <div className="event-header">
        <h1>Angelique and Zaadrick's Baby Shower</h1>
        <p className="subtitle">Join us to celebrate the arrival of our little princess!</p>
      </div>

      <div className="event-container">
        {/* Event Info Card */}
        <div className="event-info-card">
          <div className="event-icon-section">
            <div className="event-icon">👶💗</div>
            <h2>Baby Shower Celebration</h2>
          </div>

          <div className="event-details-grid">
            <div className="event-detail-item">
              <div className="event-detail-icon">📅</div>
              <div className="event-detail-content">
                <div className="event-label">Date</div>
                <div className="event-value">{eventInfo.date}</div>
              </div>
            </div>

            <div className="event-detail-item">
              <div className="event-detail-icon">📍</div>
              <div className="event-detail-content">
                <div className="event-label">Venue</div>
                <div className="event-value">{eventInfo.venue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Card */}
        <div className="event-map-card">
          <h3>Location</h3>
          <div className="map-container">
            <iframe
              title="Event Location"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${eventInfo.latitude},${eventInfo.longitude}&zoom=15`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="map-actions">
            <button className="btn btn-primary btn-block" onClick={openInMaps}>
              🧭 Get Directions
            </button>
          </div>

          <div className="venue-info">
            <h4>About the Venue</h4>
            <p>
              {eventInfo.venue} is a beautiful country retreat perfect for celebrating life's special moments.
              The venue offers a peaceful setting with stunning views, making it the ideal location for our baby shower celebration.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="event-notes-card">
          <div className="info-banner-event">
            <span className="info-icon">🎈</span>
            <div>
              <strong>Important:</strong> Please arrive 15-30 minutes early to find parking and settle in. We can't wait to celebrate with you!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

