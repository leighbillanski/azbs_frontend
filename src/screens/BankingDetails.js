import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BankingDetails = () => {
  const { user } = useAuth();
  const [copiedField, setCopiedField] = useState('');
  
  // Extract first name from user
  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(' ')[0].toLowerCase();
    }
    if (user?.email) {
      return user.email.split('@')[0].toLowerCase();
    }
    return 'user';
  };

  const bankingInfo = {
    bank: 'ABSA',
    accountNumber: '4088026917',
    branchCode: '334107',
    accountType: 'Cheque',
    reference: `azbs_${getFirstName()}`,
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField('');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className="screen-container">
      <div className="banking-static-header">
        <h1>Banking Details</h1>
        <p className="subtitle">Payment and transfer information</p>
      </div>

      <div className="banking-static-container">
        <div className="banking-static-card">
          <div className="banking-icon-header">
            <div className="bank-icon">🏦</div>
            <h2>{bankingInfo.bank}</h2>
          </div>

          <div className="banking-details-list">
            <div className="banking-detail-row highlight">
              <div className="detail-content">
                <div className="detail-label">Account Number</div>
                <div className="detail-value account-number">{bankingInfo.accountNumber}</div>
              </div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(bankingInfo.accountNumber, 'accountNumber')}
                title="Copy account number"
              >
                {copiedField === 'accountNumber' ? '✓' : '📋'}
              </button>
            </div>

            <div className="banking-detail-row">
              <div className="detail-content">
                <div className="detail-label">Branch Code</div>
                <div className="detail-value">{bankingInfo.branchCode}</div>
              </div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(bankingInfo.branchCode, 'branchCode')}
                title="Copy branch code"
              >
                {copiedField === 'branchCode' ? '✓' : '📋'}
              </button>
            </div>

            <div className="banking-detail-row">
              <div className="detail-content">
                <div className="detail-label">Account Type</div>
                <div className="detail-value">{bankingInfo.accountType}</div>
              </div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(bankingInfo.accountType, 'accountType')}
                title="Copy account type"
              >
                {copiedField === 'accountType' ? '✓' : '📋'}
              </button>
            </div>

            <div className="banking-detail-row highlight">
              <div className="detail-content">
                <div className="detail-label">Reference</div>
                <div className="detail-value reference-value">{bankingInfo.reference}</div>
              </div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(bankingInfo.reference, 'reference')}
                title="Copy reference"
              >
                {copiedField === 'reference' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="banking-footer-info">
            <div className="info-box">
              <span className="info-icon">💡</span>
              <span>Please use the reference code above when making payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingDetails;
