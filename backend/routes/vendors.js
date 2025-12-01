const express = require('express');
const router = express.Router();
const { runQuery, getOne, getAll } = require('../database');

/**
 * POST /api/vendors
 * Create a new vendor
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, company, contact_person, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await runQuery(
      `INSERT INTO vendors (name, email, company, contact_person, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, company || null, contact_person || null, phone || null]
    );

    const vendor = await getOne('SELECT * FROM vendors WHERE id = ?', [result.id]);

    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

/**
 * GET /api/vendors
 * List all vendors
 */
router.get('/', async (req, res) => {
  try {
    const vendors = await getAll('SELECT * FROM vendors ORDER BY name ASC');
    res.json(vendors);
  } catch (error) {
    console.error('Error listing vendors:', error);
    res.status(500).json({ error: 'Failed to list vendors' });
  }
});

/**
 * GET /api/vendors/:id
 * Get a specific vendor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await getOne('SELECT * FROM vendors WHERE id = ?', [id]);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error('Error getting vendor:', error);
    res.status(500).json({ error: 'Failed to get vendor' });
  }
});

/**
 * PUT /api/vendors/:id
 * Update a vendor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, company, contact_person, phone } = req.body;

    const vendor = await getOne('SELECT * FROM vendors WHERE id = ?', [id]);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    await runQuery(
      `UPDATE vendors 
       SET name = ?, email = ?, company = ?, contact_person = ?, phone = ?
       WHERE id = ?`,
      [
        name || vendor.name,
        email || vendor.email,
        company !== undefined ? company : vendor.company,
        contact_person !== undefined ? contact_person : vendor.contact_person,
        phone !== undefined ? phone : vendor.phone,
        id
      ]
    );

    const updated = await getOne('SELECT * FROM vendors WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

/**
 * DELETE /api/vendors/:id
 * Delete a vendor
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await getOne('SELECT * FROM vendors WHERE id = ?', [id]);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Check if vendor has proposals
    const proposals = await getAll('SELECT id FROM proposals WHERE vendor_id = ?', [id]);
    if (proposals.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete vendor with existing proposals',
        proposal_count: proposals.length
      });
    }

    await runQuery('DELETE FROM rfp_vendors WHERE vendor_id = ?', [id]);
    await runQuery('DELETE FROM vendors WHERE id = ?', [id]);

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
});

module.exports = router;
