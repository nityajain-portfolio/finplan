const router = require('express').Router();
const db     = require('../config/db');

// GET monthly costs summary
router.get('/:clientId/summary', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year ? `AND YEAR(entry_date) = ${parseInt(year)}` : '';
  const [rows] = await db.query(`
    SELECT
      DATE_FORMAT(entry_date, '%Y-%m') AS month,
      entry_type,
      SUM(amount) AS total_costs
    FROM cost_entries
    WHERE client_id = ? ${yearFilter}
    GROUP BY month, entry_type
    ORDER BY month
  `, [req.params.clientId]);
  res.json(rows);
});

// GET costs by category (for pie/bar)
router.get('/:clientId/by-category', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year ? `AND YEAR(ce.entry_date) = ${parseInt(year)}` : '';
  const [rows] = await db.query(`
    SELECT cc.name AS category, cc.cost_type, SUM(ce.amount) AS total
    FROM cost_entries ce
    LEFT JOIN cost_categories cc ON cc.id = ce.category_id
    WHERE ce.client_id = ? AND ce.entry_type = 'actual' ${yearFilter}
    GROUP BY ce.category_id
    ORDER BY total DESC
  `, [req.params.clientId]);
  res.json(rows);
});

// GET fixed vs variable breakdown
router.get('/:clientId/fixed-vs-variable', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year ? `AND YEAR(ce.entry_date) = ${parseInt(year)}` : '';
  const [rows] = await db.query(`
    SELECT cc.cost_type, SUM(ce.amount) AS total
    FROM cost_entries ce
    LEFT JOIN cost_categories cc ON cc.id = ce.category_id
    WHERE ce.client_id = ? AND ce.entry_type = 'actual' ${yearFilter}
    GROUP BY cc.cost_type
  `, [req.params.clientId]);
  res.json(rows);
});

module.exports = router;
