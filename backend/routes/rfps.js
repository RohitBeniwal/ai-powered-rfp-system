const express = require('express');
const router = express.Router();
const { runQuery, getOne, getAll } = require('../database');
const { parseRFPFromDescription } = require('../services/ollama');

/**
 * POST /api/rfps
 * Create a new RFP from natural language description
 */
router.post('/', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Use AI to parse the description into structured data
    const structuredData = await parseRFPFromDescription(description);

    // Insert into database
    const result = await runQuery(
      `INSERT INTO rfps (title, description, structured_data, status) VALUES (?, ?, ?, ?)`,
      [
        structuredData.title || 'Untitled RFP',
        description,
        JSON.stringify(structuredData),
        'draft'
      ]
    );

    // Fetch the created RFP
    const rfp = await getOne('SELECT * FROM rfps WHERE id = ?', [result.id]);

    res.status(201).json({
      id: rfp.id,
      title: rfp.title,
      description: rfp.description,
      structured_data: JSON.parse(rfp.structured_data),
      status: rfp.status,
      created_at: rfp.created_at
    });
  } catch (error) {
    console.error('Error creating RFP:', error);
    res.status(500).json({ error: error.message || 'Failed to create RFP' });
  }
});

/**
 * GET /api/rfps
 * List all RFPs
 */
router.get('/', async (req, res) => {
  try {
    const rfps = await getAll('SELECT * FROM rfps ORDER BY created_at DESC');

    const formatted = rfps.map(rfp => ({
      id: rfp.id,
      title: rfp.title,
      description: rfp.description,
      structured_data: JSON.parse(rfp.structured_data),
      status: rfp.status,
      created_at: rfp.created_at,
      updated_at: rfp.updated_at
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error listing RFPs:', error);
    res.status(500).json({ error: 'Failed to list RFPs' });
  }
});

/**
 * GET /api/rfps/:id
 * Get a specific RFP with vendors it was sent to
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const rfp = await getOne('SELECT * FROM rfps WHERE id = ?', [id]);

    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    // Get vendors this RFP was sent to
    const vendors = await getAll(
      `SELECT v.*, rv.sent_at 
       FROM vendors v
       JOIN rfp_vendors rv ON v.id = rv.vendor_id
       WHERE rv.rfp_id = ?`,
      [id]
    );

    res.json({
      id: rfp.id,
      title: rfp.title,
      description: rfp.description,
      structured_data: JSON.parse(rfp.structured_data),
      status: rfp.status,
      created_at: rfp.created_at,
      updated_at: rfp.updated_at,
      vendors: vendors
    });
  } catch (error) {
    console.error('Error getting RFP:', error);
    res.status(500).json({ error: 'Failed to get RFP' });
  }
});

/**
 * POST /api/rfps/:id/send
 * Mark RFP as sent to selected vendors (simulated email)
 */
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_ids } = req.body;

    if (!vendor_ids || !Array.isArray(vendor_ids) || vendor_ids.length === 0) {
      return res.status(400).json({ error: 'vendor_ids array is required' });
    }

    // Check if RFP exists
    const rfp = await getOne('SELECT * FROM rfps WHERE id = ?', [id]);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    // Insert into rfp_vendors junction table
    for (const vendorId of vendor_ids) {
      try {
        await runQuery(
          'INSERT INTO rfp_vendors (rfp_id, vendor_id) VALUES (?, ?)',
          [id, vendorId]
        );
      } catch (err) {
        // Ignore duplicate entries (already sent to this vendor)
        if (!err.message.includes('UNIQUE constraint')) {
          throw err;
        }
      }
    }

    // Update RFP status to 'sent'
    await runQuery(
      'UPDATE rfps SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['sent', id]
    );

    // Get updated vendors list
    const vendors = await getAll(
      `SELECT v.*, rv.sent_at 
       FROM vendors v
       JOIN rfp_vendors rv ON v.id = rv.vendor_id
       WHERE rv.rfp_id = ?`,
      [id]
    );

    res.json({
      message: 'RFP sent successfully',
      rfp_id: parseInt(id),
      vendors_count: vendors.length,
      vendors: vendors
    });
  } catch (error) {
    console.error('Error sending RFP:', error);
    res.status(500).json({ error: 'Failed to send RFP' });
  }
});

/**
 * GET /api/rfps/:id/proposals
 * Get all proposals for a specific RFP
 */
router.get('/:id/proposals', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if RFP exists
    const rfp = await getOne('SELECT * FROM rfps WHERE id = ?', [id]);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const proposals = await getAll(
      `SELECT p.*, v.name as vendor_name, v.company as vendor_company
       FROM proposals p
       JOIN vendors v ON p.vendor_id = v.id
       WHERE p.rfp_id = ?
       ORDER BY p.received_at DESC`,
      [id]
    );

    const formatted = proposals.map(p => ({
      id: p.id,
      rfp_id: p.rfp_id,
      vendor_id: p.vendor_id,
      vendor_name: p.vendor_name,
      vendor_company: p.vendor_company,
      raw_response: p.raw_response,
      parsed_data: JSON.parse(p.parsed_data),
      status: p.status,
      received_at: p.received_at
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error getting proposals:', error);
    res.status(500).json({ error: 'Failed to get proposals' });
  }
});

/**
 * DELETE /api/rfps/:id
 * Delete an RFP
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if RFP exists
    const rfp = await getOne('SELECT * FROM rfps WHERE id = ?', [id]);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    // Delete related data
    await runQuery('DELETE FROM proposals WHERE rfp_id = ?', [id]);
    await runQuery('DELETE FROM rfp_vendors WHERE rfp_id = ?', [id]);
    await runQuery('DELETE FROM rfps WHERE id = ?', [id]);

    res.json({ message: 'RFP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RFP:', error);
    res.status(500).json({ error: 'Failed to delete RFP' });
  }
});

module.exports = router;
