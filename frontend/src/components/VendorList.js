import React, { useState, useEffect } from 'react';
import { createVendor, listVendors } from '../api';

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    contact_person: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await listVendors();
      setVendors(response.data);
    } catch (err) {
      setError('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await createVendor(formData);
      alert('Vendor added successfully!');
      setFormData({
        name: '',
        email: '',
        company: '',
        contact_person: '',
        phone: ''
      });
      setShowForm(false);
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vendor');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="vendor-list">
      <div className="header">
        <h2>🏢 Vendor Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '➕ Add Vendor'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="vendor-form">
          <h3>Add New Vendor</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Vendor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Adding...' : 'Add Vendor'}
            </button>
          </form>
        </div>
      )}

      <div className="vendor-grid">
        {vendors.length === 0 ? (
          <p>No vendors added yet. Add your first vendor!</p>
        ) : (
          vendors.map((vendor) => (
            <div key={vendor.id} className="vendor-card">
              <h3>{vendor.name}</h3>
              {vendor.company && <p className="company">📍 {vendor.company}</p>}
              <p>📧 {vendor.email}</p>
              {vendor.contact_person && <p>👤 {vendor.contact_person}</p>}
              {vendor.phone && <p>📞 {vendor.phone}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VendorList;
