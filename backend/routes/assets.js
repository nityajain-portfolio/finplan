// routes/assets.js
const router = require('express').Router();
const db     = require('../config/db');
router.get('/:clientId', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM assets WHERE client_id = ? ORDER BY asset_type, asset_name', [req.params.clientId]);
  res.json(rows);
});
router.post('/:clientId', async (req, res) => {
  const { asset_name, asset_type, purchase_date, purchase_value, current_value, depreciation_rate, as_of_date, notes } = req.body;
  const [r] = await db.query(
    `INSERT INTO assets (client_id,asset_name,asset_type,purchase_date,purchase_value,current_value,depreciation_rate,as_of_date,notes) VALUES (?,?,?,?,?,?,?,?,?)`,
    [req.params.clientId, asset_name, asset_type, purchase_date, purchase_value, current_value, depreciation_rate, as_of_date, notes]
  );
  res.json({ id: r.insertId });
});
module.exports = router;
