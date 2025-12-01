import React, { useState, useEffect } from 'react';
import { listRFPs, listVendors, submitProposal } from '../api';

function SimulateResponse() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRFP, setSelectedRFP] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rfpsRes, vendorsRes] = await Promise.all([
        listRFPs(),
        listVendors()
      ]);
      setRfps(rfpsRes.data.filter(rfp => rfp.status === 'sent'));
      setVendors(vendorsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await submitProposal({
        rfp_id: parseInt(selectedRFP),
        vendor_id: parseInt(selectedVendor),
        response_text: responseText
      });
      setSuccess(true);
      setResponseText('');
      alert('Vendor response submitted and parsed successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const exampleResponses = [
    {
      vendor: "Dell",
      text: "We can provide 20 laptops at $2,000 each (total $40,000) and 15 monitors at $500 each (total $7,500). Grand total: $47,500. Delivery within 25 days. 2-year warranty included. Payment terms: Net 30."
    },
    {
      vendor: "HP",
      text: "Proposal for laptops and monitors: 20 laptops @ $2,200 per unit = $44,000, 15 monitors @ $550 each = $8,250. Total cost: $52,250. We can deliver in 20 days with 1-year warranty. Net 30 payment terms."
    },
    {
      vendor: "Lenovo",
      text: "Our offer: 20 high-performance laptops at $1,900 each totaling $38,000, plus 15 professional monitors at $480 each totaling $7,200. Complete package: $45,200. Fastest delivery in 15 days! Extended 3-year warranty. Net 45 payment terms available."
    }
  ];

  const fillExample = (example) => {
    setResponseText(example.text);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="simulate-response">
      <h2>📝 Simulate Vendor Response</h2>
      <p className="subtitle">Simulate a vendor responding to an RFP. AI will automatically parse the response.</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">✅ Response submitted and parsed by AI!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Select RFP:</label>
            <select
              value={selectedRFP}
              onChange={(e) => setSelectedRFP(e.target.value)}
              required
            >
              <option value="">Choose an RFP...</option>
              {rfps.map((rfp) => (
                <option key={rfp.id} value={rfp.id}>
                  {rfp.title} (ID: {rfp.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Vendor:</label>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              required
            >
              <option value="">Choose a vendor...</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Vendor Response (can be messy, AI will parse it):</label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Paste vendor's response here. Can include pricing, delivery times, warranty terms, etc."
            rows="10"
            required
          />
        </div>

        <div className="example-responses">
          <p><strong>Quick Fill Examples:</strong></p>
          {exampleResponses.map((example, index) => (
            <button
              key={index}
              type="button"
              className="btn-secondary"
              onClick={() => fillExample(example)}
            >
              {example.vendor} Example
            </button>
          ))}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? '🤖 AI Parsing...' : '📤 Submit Response'}
        </button>
      </form>
    </div>
  );
}

export default SimulateResponse;
