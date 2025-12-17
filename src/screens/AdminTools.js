import React, { useState } from 'react';
import { getAllItems, getAllClaims } from '../api/api';
import { useAuth } from '../context/AuthContext';

const AdminTools = () => {
  const [exporting, setExporting] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const convertToCSV = (data, headers) => {
    const headerRow = headers.join(',');
    const rows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma or newline
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    );
    return [headerRow, ...rows].join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportItemsToPDF = async () => {
    setExportingPDF(true);
    setError('');
    setSuccess('');

    try {
      // Fetch items data
      const itemsResponse = await getAllItems();

      if (!itemsResponse.success) {
        throw new Error('Failed to fetch items from server');
      }

      const items = itemsResponse.data || [];
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();

      // Create HTML for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Items Report - AZBS</title>
          <style>
            @media print {
              @page { margin: 1cm; }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #ff6b9d;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #d81b60;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .summary {
              background: #fff5f8;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #ff6b9d;
            }
            .summary h3 {
              color: #d81b60;
              margin-top: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            thead {
              background: linear-gradient(135deg, #ff6b9d 0%, #ffc3e0 100%);
              color: white;
            }
            th {
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e0e0e0;
            }
            tbody tr:nth-child(even) {
              background: #fafafa;
            }
            tbody tr:hover {
              background: #fff5f8;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
            }
            .available {
              background: #e8f5e9;
              color: #2e7d32;
            }
            .low-stock {
              background: #fff3cd;
              color: #856404;
            }
            .fully-claimed {
              background: #ffebee;
              color: #c62828;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>👶💗 AZBS - Items Report</h1>
            <p><strong>Angelique & Zaadrick's Baby Shower</strong></p>
            <p>Generated on ${currentDate} at ${currentTime}</p>
            <p>Exported by: ${user.email}</p>
          </div>

          <div class="summary">
            <h3>📊 Summary</h3>
            <p><strong>Total Items:</strong> ${items.length}</p>
            <p><strong>Total Quantity:</strong> ${items.reduce((sum, item) => sum + item.item_count, 0)}</p>
            <p><strong>Total Claimed:</strong> ${items.reduce((sum, item) => sum + (item.claimed_count || 0), 0)}</p>
            <p><strong>Total Available:</strong> ${items.reduce((sum, item) => sum + (item.item_count - (item.claimed_count || 0)), 0)}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th style="text-align: center;">Total Qty</th>
                <th style="text-align: center;">Claimed</th>
                <th style="text-align: center;">Available</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => {
                const available = item.item_count - (item.claimed_count || 0);
                let statusClass = 'available';
                let statusText = 'Available';
                
                if (available === 0) {
                  statusClass = 'fully-claimed';
                  statusText = 'Fully Claimed';
                } else if (available <= item.item_count * 0.3) {
                  statusClass = 'low-stock';
                  statusText = 'Low Stock';
                }
                
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.item_name}</strong></td>
                    <td style="text-align: center;">${item.item_count}</td>
                    <td style="text-align: center;">${item.claimed_count || 0}</td>
                    <td style="text-align: center;">${available}</td>
                    <td style="text-align: center;">
                      <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>This report was generated from the AZBS Baby Shower Management System</p>
            <p>For questions or support, contact the event organizer</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `;

      // Open new window and print
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      setSuccess('PDF print dialog opened! Use "Save as PDF" in the print dialog.');
    } catch (err) {
      console.error('PDF export error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  const exportData = async () => {
    setExporting(true);
    setError('');
    setSuccess('');

    try {
      // Fetch all data
      const [itemsResponse, claimsResponse] = await Promise.all([
        getAllItems(),
        getAllClaims()
      ]);

      if (!itemsResponse.success || !claimsResponse.success) {
        throw new Error('Failed to fetch data from server');
      }

      const items = itemsResponse.data || [];
      const claims = claimsResponse.data || [];
      const dateStamp = new Date().toISOString().split('T')[0];

      // Export Items Table
      const itemsData = items.map(item => ({
        'Item Name': item.item_name,
        'Total Quantity': item.item_count,
        'Claimed Quantity': item.claimed_count || 0,
        'Available Quantity': item.item_count - (item.claimed_count || 0)
      }));
      const itemsCSV = convertToCSV(itemsData, ['Item Name', 'Total Quantity', 'Claimed Quantity', 'Available Quantity']);
      downloadCSV(itemsCSV, `items-${dateStamp}.csv`);

      // Export Claims Table
      const claimsData = claims.map(claim => ({
        'Guest Name': claim.guest_name,
        'Guest Number': claim.guest_number,
        'Item Name': claim.item_name,
        'Quantity': claim.quantity_claimed || claim.quantity || 0,
        'Claimed At': claim.created_at ? new Date(claim.created_at).toLocaleString() : ''
      }));
      const claimsCSV = convertToCSV(claimsData, ['Guest Name', 'Guest Number', 'Item Name', 'Quantity', 'Claimed At']);
      downloadCSV(claimsCSV, `claims-${dateStamp}.csv`);

      // Export Guests Summary Table (unique guests with totals)
      const guestsMap = new Map();
      claims.forEach(claim => {
        const key = `${claim.guest_name}-${claim.guest_number}`;
        if (!guestsMap.has(key)) {
          guestsMap.set(key, {
            'Guest Name': claim.guest_name,
            'Guest Number': claim.guest_number,
            'Total Items Claimed': 0,
            'Number of Products': 0
          });
        }
        const guest = guestsMap.get(key);
        guest['Total Items Claimed'] += claim.quantity_claimed || claim.quantity || 0;
        guest['Number of Products'] += 1;
      });
      const guestsData = Array.from(guestsMap.values());
      const guestsCSV = convertToCSV(guestsData, ['Guest Name', 'Guest Number', 'Total Items Claimed', 'Number of Products']);
      downloadCSV(guestsCSV, `guests-${dateStamp}.csv`);

      // Export Summary Table
      const summaryData = [{
        'Metric': 'Total Items',
        'Count': items.length
      }, {
        'Metric': 'Total Claims',
        'Count': claims.length
      }, {
        'Metric': 'Total Items Claimed',
        'Count': claims.reduce((sum, claim) => sum + (claim.quantity_claimed || claim.quantity || 0), 0)
      }, {
        'Metric': 'Total Guests',
        'Count': guestsMap.size
      }, {
        'Metric': 'Export Date',
        'Count': new Date().toLocaleString()
      }, {
        'Metric': 'Exported By',
        'Count': user.email
      }];
      const summaryCSV = convertToCSV(summaryData, ['Metric', 'Count']);
      downloadCSV(summaryCSV, `summary-${dateStamp}.csv`);

      setSuccess(`Successfully exported 4 CSV files: items, claims, guests, and summary!`);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="admin-tools-header">
        <h1>⚙️ Admin Tools</h1>
        <p className="subtitle">Export and manage event data</p>
      </div>

      <div className="admin-tools-container">
        <div className="admin-card">
          <div className="export-icon-section">
            <span className="export-icon">📊</span>
            <h2>Export Event Data</h2>
            <p>Download complete event data in Excel-compatible CSV format (4 separate files).</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="admin-actions">
            <button 
              onClick={exportData}
              disabled={exporting || exportingPDF}
              className="btn btn-primary btn-export"
            >
              {exporting ? '⏳ Exporting...' : '📥 Export to Excel (CSV)'}
            </button>
            <button 
              onClick={exportItemsToPDF}
              disabled={exporting || exportingPDF}
              className="btn btn-secondary btn-export"
            >
              {exportingPDF ? '⏳ Generating...' : '📄 Export Items to PDF'}
            </button>
          </div>
        </div>

        <div className="admin-info-card">
          <h3>ℹ️ Export Information</h3>
          
          <h4 style={{ color: '#d81b60', marginTop: '1rem' }}>📥 CSV Export (4 files):</h4>
          <ul>
            <li style={{ marginLeft: '1rem' }}>📋 <strong>items-YYYY-MM-DD.csv</strong> - All items with quantities</li>
            <li style={{ marginLeft: '1rem' }}>🎁 <strong>claims-YYYY-MM-DD.csv</strong> - All claims with guest details</li>
            <li style={{ marginLeft: '1rem' }}>👥 <strong>guests-YYYY-MM-DD.csv</strong> - Guest summary with totals</li>
            <li style={{ marginLeft: '1rem' }}>📊 <strong>summary-YYYY-MM-DD.csv</strong> - Event statistics</li>
            <li><strong>Best for:</strong> Analysis in Excel, Google Sheets, or databases</li>
          </ul>

          <h4 style={{ color: '#d81b60', marginTop: '1.5rem' }}>📄 PDF Export:</h4>
          <ul>
            <li><strong>Content:</strong> Complete items table with status indicators (Available / Low Stock / Fully Claimed)</li>
            <li><strong>Format:</strong> Professional PDF report with summary statistics</li>
            <li><strong>Best for:</strong> Printing, sharing, or archiving</li>
            <li><strong>How to:</strong> Click button → Print dialog opens → Select "Save as PDF"</li>
          </ul>
          
          <div className="info-banner-admin">
            <span className="info-icon">💡</span>
            <div>
              <strong>Tip:</strong> Use CSV for data analysis and PDF for professional reports or printing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;

