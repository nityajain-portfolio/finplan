const router = require('express').Router();
const db     = require('../config/db');

// GET monthly revenue for a client (grouped by month + stream)
router.get('/:clientId/monthly', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year ? `AND YEAR(entry_date) = ${parseInt(year)}` : '';
  const [rows] = await db.query(`
    SELECT
      DATE_FORMAT(re.entry_date, '%Y-%m') AS month,
      rs.name AS stream,
      re.entry_type,
      SUM(re.amount) AS total
    FROM revenue_entries re
    LEFT JOIN revenue_streams rs ON rs.id = re.stream_id
    WHERE re.client_id = ? ${yearFilter}
    GROUP BY month, re.stream_id, re.entry_type
    ORDER BY month
  `, [req.params.clientId]);
  res.json(rows);
});

// GET revenue summary (total by month)
router.get('/:clientId/summary', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year ? `AND YEAR(entry_date) = ${parseInt(year)}` : '';
  const [rows] = await db.query(`
    SELECT
      DATE_FORMAT(entry_date, '%Y-%m') AS month,
      entry_type,
      SUM(amount) AS total_revenue
    FROM revenue_entries
    WHERE client_id = ? ${yearFilter}
    GROUP BY month, entry_type
    ORDER BY month
  `, [req.params.clientId]);
  res.json(rows);
});

// GET revenue by stream (pie chart data)
router.get('/:clientId/by-stream', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year ? `AND YEAR(re.entry_date) = ${parseInt(year)}` : '';
  const [rows] = await db.query(`
    SELECT rs.name AS stream, SUM(re.amount) AS total
    FROM revenue_entries re
    LEFT JOIN revenue_streams rs ON rs.id = re.stream_id
    WHERE re.client_id = ? AND re.entry_type = 'actual' ${yearFilter}
    GROUP BY re.stream_id
    ORDER BY total DESC
  `, [req.params.clientId]);
  res.json(rows);
});

// POST add revenue entry
router.post('/:clientId', async (req, res) => {
  const { stream_id, entry_date, amount, entry_type, notes } = req.body;
  const [result] = await db.query(
    `INSERT INTO revenue_entries (client_id,stream_id,entry_date,amount,entry_type,notes) VALUES (?,?,?,?,?,?)`,
    [req.params.clientId, stream_id, entry_date, amount, entry_type||'actual', notes]
  );
  res.json({ id: result.insertId, message: 'Revenue entry added' });
});

module.exports = router;
