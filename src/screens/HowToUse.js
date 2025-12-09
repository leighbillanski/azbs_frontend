import React, { useState } from 'react';

const HowToUse = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'getting-started',
      icon: '🚀',
      title: 'Getting Started',
      steps: [
        'Create an account by clicking "Register" and filling in your details',
        'Log in with your email address',
        'You\'ll be taken to the home page with quick access to all features',
      ]
    },
    {
      id: 'rsvp',
      icon: '✉️',
      title: 'Managing Your RSVP',
      steps: [
        'Go to the RSVP page from the menu',
        'Add guests by clicking "Add New Guest" button',
        'For each guest, select "Going" or "Not Going" using the radio buttons',
        'Your RSVP status is automatically saved',
        'You can update your guests\' RSVP status anytime',
      ]
    },
    {
      id: 'claiming-items',
      icon: '🎁',
      title: 'Claiming Baby Items',
      steps: [
        'Navigate to "Browse Items" from the menu',
        'Browse through the list of baby items needed',
        'Select items you want to claim by checking the boxes',
        'Choose the quantity you want to claim for each item',
        'Click "Claim Selected Items"',
        'Select which guest the items are for (yourself or another guest)',
        'Or add a new guest if claiming for someone not on your list',
      ]
    },
    {
      id: 'viewing-claims',
      icon: '📦',
      title: 'Viewing Your Claimed Items',
      steps: [
        'Go to "Your Claims" from the menu',
        'See all guests you\'ve added and their claimed items',
        'View statistics: total guests, products, and item quantities',
        'Edit quantities by clicking the edit (✏️) button',
        'Remove claimed items by clicking the delete (🗑️) button',
        'All changes are saved automatically',
      ]
    },
    {
      id: 'event-details',
      icon: '🗺️',
      title: 'Event Details & Directions',
      steps: [
        'Click "Event Details" from the menu',
        'View the date: 10 January 2026',
        'View the venue: The Hamlet Country Lodge',
        'Click "Get Directions" to open Google Maps',
        'Save the date in your calendar!',
      ]
    },
    {
      id: 'banking',
      icon: '💳',
      title: 'Banking Details for Gifts',
      steps: [
        'Go to "Banking Details" from the menu',
        'View the bank account information',
        'Use the reference: azbs_YourFirstName',
        'Click the copy (📋) icon next to any detail to copy it',
        'Use these details if you prefer to send a monetary gift',
      ]
    },
    {
      id: 'profile',
      icon: '👤',
      title: 'Managing Your Profile',
      steps: [
        'Click your name in the top-right corner or go to "Profile"',
        'View your account information',
        'Click "Edit Profile" to update your details',
        'Change your name, email, or phone number',
        'Click "Save Changes" to update your profile',
        'Click "Cancel" to discard changes',
      ]
    },
  ];

  return (
    <div className="screen-container">
      <div className="how-to-header">
        <div className="how-to-icon-large">📖</div>
        <h1>How to Use This App</h1>
        <p className="subtitle">Your complete guide to celebrating with us!</p>
      </div>

      <div className="how-to-intro">
        <div className="intro-card">
          <h3>Welcome! 👋</h3>
          <p>
            This app makes it easy to RSVP, claim baby items, and stay informed about 
            Angelique & Zaadrick's Baby Shower. Follow the guides below to get started!
          </p>
        </div>
      </div>

      <div className="how-to-sections">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className={`how-to-section ${expandedSection === section.id ? 'expanded' : ''}`}
          >
            <div 
              className="section-header"
              onClick={() => toggleSection(section.id)}
            >
              <div className="section-header-left">
                <span className="section-number">{index + 1}</span>
                <span className="section-icon">{section.icon}</span>
                <h3>{section.title}</h3>
              </div>
              <span className="expand-icon">
                {expandedSection === section.id ? '−' : '+'}
              </span>
            </div>

            {expandedSection === section.id && (
              <div className="section-content">
                <ol className="steps-list">
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="how-to-tips">
        <h2>💡 Quick Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">⏰</span>
            <h4>Stay Active</h4>
            <p>The app will log you out after 15 minutes of inactivity for security</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📱</span>
            <h4>Mobile Friendly</h4>
            <p>Works great on phones! Add to your home screen for quick access</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🔄</span>
            <h4>Real-time Updates</h4>
            <p>All changes are saved immediately to the database</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">👥</span>
            <h4>Multiple Guests</h4>
            <p>You can add and manage multiple guests under your account</p>
          </div>
        </div>
      </div>

      <div className="how-to-help">
        <div className="help-card">
          <h3>Need More Help? 💗</h3>
          <p>
            If you have any questions or run into issues, please reach out to Angelique or Zaadrick. 
            We're here to help make this celebration special!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;

