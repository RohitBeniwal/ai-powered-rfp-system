import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RFP APIs
export const createRFP = (description) => {
  return api.post('/rfps', { description });
};

export const listRFPs = () => {
  return api.get('/rfps');
};

export const getRFP = (id) => {
  return api.get(`/rfps/${id}`);
};

export const sendRFP = (id, vendorIds) => {
  return api.post(`/rfps/${id}/send`, { vendor_ids: vendorIds });
};

export const getRFPProposals = (id) => {
  return api.get(`/rfps/${id}/proposals`);
};

export const getProposalComparison = (rfpId) => {
  return api.get(`/proposals/rfp/${rfpId}/comparison`);
};

// Vendor APIs
export const createVendor = (vendorData) => {
  return api.post('/vendors', vendorData);
};

export const listVendors = () => {
  return api.get('/vendors');
};

export const getVendor = (id) => {
  return api.get(`/vendors/${id}`);
};

// Proposal APIs
export const submitProposal = (proposalData) => {
  return api.post('/proposals/submit', proposalData);
};

// Health Check
export const healthCheck = () => {
  return api.get('/health');
};

export default api;
