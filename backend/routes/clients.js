const router = require('express').Router();
const db     = require('../config/db');

// GET all clients
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM clients ORDER BY company_name');
  res.json(rows);
});

// GET single client
router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Client not found' });
  res.json(rows[0]);
});

// POST create client
router.post('/', async (req, res) => {
  const { company_name, industry, contact_name, contact_email, contact_phone, address, fiscal_year_start, currency, status, notes } = req.body;
  const [result] = await db.query(
    `INSERT INTO clients (company_name,industry,contact_name,contact_email,contact_phone,address,fiscal_year_start,currency,status,notes)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [company_name, industry, contact_name, contact_email, contact_phone, address, fiscal_year_start||1, currency||'USD', status||'active', notes]
  );
  res.json({ id: result.insertId, message: 'Client created' });
});

// PUT update client
router.put('/:id', async (req, res) => {
  const { company_name, industry, contact_name, contact_email, contact_phone, address, status, notes } = req.body;
  await db.query(
    `UPDATE clients SET company_name=?,industry=?,contact_name=?,contact_email=?,contact_phone=?,address=?,status=?,notes=? WHERE id=?`,
    [company_name, industry, contact_name, contact_email, contact_phone, address, status, notes, req.params.id]
  );
  res.json({ message: 'Client updated' });
});

module.exports = router;
