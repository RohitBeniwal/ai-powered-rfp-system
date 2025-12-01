const express = require('express');
const router = express.Router();
const { runQuery, getOne, getAll } = require('../database');
const { parseVendorResponse, compareProposals } = require('../services/ollama');

/**
 * POST /api/proposals/submit
 * Submit a vendor response (simulated email)
 */
router.post('/submit', async (req, res) => {
  try {
    const { rfp_id, vendor_id, response_text } = req.body;

    if (!rfp_id || !vendor_id || !response_text) {
      return res.status(400).json({ 
        error: 'rfp_id, vendor_id, and response_text are required' 
      });
    }

    // Validate RFP exists
    const rfp = await getOne('SELECT * FROM rfps WHERE id = ?', [rfp_id]);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    // Validate vendor exists
    const vendor = await getOne('SELECT * FROM vendors WHERE id = ?', [vendor_id]);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Use AI to parse the vendor response
    const parsedData = await parseVendorResponse(response_text);

    // Insert proposal into database
    const result = await runQuery(
      `INSERT INTO proposals (rfp_id, vendor_id, raw_response, parsed_data, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [rfp_id, vendor_id, response_text, JSON.stringify(parsedData), 'received']
    );

    // Fetch the created proposal with vendor info
    const proposal = await getOne(
      `SELECT p.*, v.name as vendor_name, v.company as vendor_company
       FROM proposals p
       JOIN vendors v ON p.vendor_id = v.id
       WHERE p.id = ?`,
      [result.id]
    );

    res.status(201).json({
      id: proposal.id,
      rfp_id: proposal.rfp_id,
      vendor_id: proposal.vendor_id,
      vendor_name: proposal.vendor_name,
      vendor_company: proposal.vendor_company,
      raw_response: proposal.raw_response,
      parsed_data: JSON.parse(proposal.parsed_data),
      status: proposal.status,
      received_at: proposal.received_at
    });
  } catch (error) {
    console.error('Error submitting proposal:', error);
    res.status(500).json({ error: error.message || 'Failed to submit proposal' });
  }
});

/**
 * GET /api/proposals/:id
 * Get a specific proposal
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await getOne(
      `SELECT p.*, v.name as vendor_name, v.company as vendor_company
       FROM proposals p
       JOIN vendors v ON p.vendor_id = v.id
       WHERE p.id = ?`,
      [id]
    );

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    res.json({
      id: proposal.id,
      rfp_id: proposal.rfp_id,
      vendor_id: proposal.vendor_id,
      vendor_name: proposal.vendor_name,
      vendor_company: proposal.vendor_company,
      raw_response: proposal.raw_response,
      parsed_data: JSON.parse(proposal.parsed_data),
      status: proposal.status,
      received_at: proposal.received_at
    });
  } catch (error) {
    console.error('Error getting proposal:', error);
    res.status(500).json({ error: 'Failed to get proposal' });
  }
});

/**
 * GET /api/proposals/rfp/:rfp_id/comparison
 * Get AI-powered comparison of all proposals for an RFP
 */
router.get('/rfp/:rfp_id/comparison', async (req, res) => {
  try {
    const { rfp_id } = req.params;

    // Get RFP data
    const rfp = await getOne('SELECT * FROM rfps WHERE id = ?', [rfp_id]);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    // Get all proposals for this RFP
    const proposals = await getAll(
      `SELECT p.*, v.name as vendor_name, v.company as vendor_company
       FROM proposals p
       JOIN vendors v ON p.vendor_id = v.id
       WHERE p.rfp_id = ?
       ORDER BY p.received_at DESC`,
      [rfp_id]
    );

    if (proposals.length === 0) {
      return res.status(400).json({ 
        error: 'No proposals found for this RFP',
        message: 'At least one proposal is required for comparison'
      });
    }

    // Format proposals for comparison
    const formattedProposals = proposals.map(p => ({
      id: p.id,
      vendor_name: p.vendor_name,
      vendor_company: p.vendor_company,
      parsed_data: JSON.parse(p.parsed_data),
      received_at: p.received_at
    }));

    // Get AI comparison
    const rfpData = {
      title: rfp.title,
      description: rfp.description,
      structured_data: JSON.parse(rfp.structured_data)
    };

    const comparison = await compareProposals(rfpData, formattedProposals);

    res.json({
      rfp_id: parseInt(rfp_id),
      rfp_title: rfp.title,
      proposals_count: proposals.length,
      proposals: formattedProposals,
      ai_analysis: comparison
    });
  } catch (error) {
    console.error('Error comparing proposals:', error);
    res.status(500).json({ error: error.message || 'Failed to compare proposals' });
  }
});

/**
 * DELETE /api/proposals/:id
 * Delete a proposal
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await getOne('SELECT * FROM proposals WHERE id = ?', [id]);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    await runQuery('DELETE FROM proposals WHERE id = ?', [id]);

    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
});

module.exports = router;
