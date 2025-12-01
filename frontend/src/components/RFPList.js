import React, { useState, useEffect } from 'react';
import { listRFPs, getRFP, sendRFP, listVendors } from '../api';
import { useNavigate } from 'react-router-dom';

function RFPList() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRFP, setSelectedRFP] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rfpsRes, vendorsRes] = await Promise.all([
        listRFPs(),
        listVendors()
      ]);
      setRfps(rfpsRes.data);
      setVendors(vendorsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRFP = async (rfp) => {
    try {
      const response = await getRFP(rfp.id);
      setSelectedRFP(response.data);
      setSelectedVendors([]);
    } catch (err) {
      setError('Failed to load RFP details');
    }
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      alert('Please select at least one vendor');
      return;
    }

    setSending(true);
    try {
      await sendRFP(selectedRFP.id, selectedVendors);
      alert('RFP sent successfully!');
      fetchData();
      setSelectedRFP(null);
      setSelectedVendors([]);
    } catch (err) {
      alert('Failed to send RFP');
    } finally {
      setSending(false);
    }
  };

  const toggleVendor = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="rfp-list">
      <div className="header">
        <h2>📋 RFP List</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="rfp-grid">
        {rfps.length === 0 ? (
          <p>No RFPs created yet. Create your first RFP!</p>
        ) : (
          rfps.map((rfp) => (
            <div key={rfp.id} className="rfp-card">
              <h3>{rfp.title}</h3>
              <p className="status-badge">{rfp.status}</p>
              <p>{rfp.description.substring(0, 100)}...</p>
              <div className="card-actions">
                <button onClick={() => handleSelectRFP(rfp)} className="btn-secondary">
                  View Details
                </button>
                <button 
                  onClick={() => navigate(`/comparison/${rfp.id}`)} 
                  className="btn-secondary"
                >
                  Compare Proposals
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRFP && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedRFP.title}</h3>
            <div className="rfp-details">
              <p><strong>Description:</strong> {selectedRFP.description}</p>
              <div className="structured-data">
                <strong>Structured Data:</strong>
                <pre>{JSON.stringify(selectedRFP.structured_data, null, 2)}</pre>
              </div>
              <p><strong>Status:</strong> {selectedRFP.status}</p>
            </div>

            {selectedRFP.status === 'draft' && (
              <>
                <h4>Select Vendors to Send RFP:</h4>
                <div className="vendor-selection">
                  {vendors.map((vendor) => (
                    <label key={vendor.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => toggleVendor(vendor.id)}
                      />
                      {vendor.name} ({vendor.email})
                    </label>
                  ))}
                </div>

                <div className="modal-actions">
                  <button onClick={handleSendRFP} disabled={sending} className="btn-primary">
                    {sending ? 'Sending...' : '📤 Send RFP'}
                  </button>
                  <button onClick={() => setSelectedRFP(null)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {selectedRFP.status === 'sent' && (
              <div className="sent-info">
                <p>✅ This RFP has been sent to vendors</p>
                <button onClick={() => setSelectedRFP(null)} className="btn-secondary">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RFPList;
