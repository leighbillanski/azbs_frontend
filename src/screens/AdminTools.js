import React, { useState } from 'react';
import { createItem, deleteItem } from '../api/api';
import { mockItems } from '../utils/mockData';

const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addMockItems = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setResults([]);

    const addedItems = [];
    const failedItems = [];

    for (const item of mockItems) {
      try {
        const response = await createItem(item);
        if (response && response.success) {
          addedItems.push(item.item_name);
        } else {
          failedItems.push({ name: item.item_name, error: response?.error || 'Unknown error' });
        }
      } catch (err) {
        failedItems.push({ name: item.item_name, error: err.message });
      }
    }

    setResults([
      ...addedItems.map(name => ({ name, status: 'success' })),
      ...failedItems.map(item => ({ name: item.name, status: 'failed', error: item.error }))
    ]);

    if (failedItems.length === 0) {
      setSuccess(`Successfully added all ${addedItems.length} items!`);
    } else if (addedItems.length === 0) {
      setError('Failed to add any items. Please check your backend connection.');
    } else {
      setSuccess(`Added ${addedItems.length} items. ${failedItems.length} failed.`);
    }

    setLoading(false);
  };

  const deleteMockItems = async () => {
    if (!window.confirm(`Are you sure you want to delete all ${mockItems.length} mock items? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setError('');
    setSuccess('');
    setResults([]);

    const deletedItems = [];
    const failedItems = [];

    for (const item of mockItems) {
      try {
        const response = await deleteItem(item.item_name);
        if (response && response.success) {
          deletedItems.push(item.item_name);
        } else {
          failedItems.push({ name: item.item_name, error: response?.error || 'Unknown error' });
        }
      } catch (err) {
        failedItems.push({ name: item.item_name, error: err.message });
      }
    }

    setResults([
      ...deletedItems.map(name => ({ name, status: 'deleted' })),
      ...failedItems.map(item => ({ name: item.name, status: 'failed', error: item.error }))
    ]);

    if (failedItems.length === 0) {
      setSuccess(`Successfully deleted all ${deletedItems.length} items!`);
    } else if (deletedItems.length === 0) {
      setError('Failed to delete any items. They may not exist in the database.');
    } else {
      setSuccess(`Deleted ${deletedItems.length} items. ${failedItems.length} failed.`);
    }

    setDeleting(false);
  };

  return (
    <div className="screen-container">
      <div className="admin-tools-header">
        <h1>🛠️ Admin Tools</h1>
        <p className="subtitle">Development utilities for testing</p>
      </div>

      <div className="admin-tools-container">
        <div className="admin-card">
          <h2>Mock Data Generator</h2>
          <p>Add mock baby shower items to the database for testing RSVP and claim functionality.</p>
          
          <div className="mock-data-preview">
            <h3>Items to be added: ({mockItems.length})</h3>
            <ul className="item-preview-list">
              {mockItems.slice(0, 5).map((item, index) => (
                <li key={index}>
                  <strong>{item.item_name}</strong> - Qty: {item.item_count}
                </li>
              ))}
              {mockItems.length > 5 && (
                <li className="more-items">...and {mockItems.length - 5} more items</li>
              )}
            </ul>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="admin-actions">
            <button 
              onClick={addMockItems}
              disabled={loading || deleting}
              className="btn btn-primary"
            >
              {loading ? 'Adding Items...' : '➕ Add Mock Items'}
            </button>

            <button 
              onClick={deleteMockItems}
              disabled={loading || deleting}
              className="btn btn-danger"
            >
              {deleting ? 'Deleting Items...' : '🗑️ Delete Mock Items'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="results-section">
              <h3>Results:</h3>
              <div className="results-list">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`result-item ${result.status}`}
                  >
                    <span className="result-icon">
                      {result.status === 'success' ? '✓' : result.status === 'deleted' ? '🗑️' : '✗'}
                    </span>
                    <span className="result-name">{result.name}</span>
                    {result.error && (
                      <span className="result-error">{result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="admin-info-card">
          <h3>ℹ️ Information</h3>
          <ul>
            <li>This tool adds {mockItems.length} baby shower items to your backend</li>
            <li>Each item includes name, image, purchase link, and quantity</li>
            <li>All items are created as unclaimed</li>
            <li>You can then test the RSVP and claim functionality</li>
            <li>Items can be managed through the regular Items page</li>
          </ul>
          
          <div className="warning-box">
            <strong>⚠️ Note:</strong> This is a development tool. Some items may fail if they already exist in the database.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;

