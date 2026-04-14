const router = require('express').Router();
const db     = require('../config/db');
router.get('/:clientId', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM kpi_snapshots WHERE client_id = ? ORDER BY snapshot_date', [req.params.clientId]);
  res.json(rows);
});
module.exports = router;
