const router = require('express').Router();
const db     = require('../config/db');
router.get('/:clientId', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year ? `AND YEAR(entry_date) = ${parseInt(year)}` : '';
  const [rows] = await db.query(`
    SELECT DATE_FORMAT(entry_date,'%Y-%m') AS month, flow_type, direction, SUM(amount) AS total
    FROM cashflow_entries
    WHERE client_id = ? ${yearFilter}
    GROUP BY month, flow_type, direction
    ORDER BY month
  `, [req.params.clientId]);
  res.json(rows);
});
module.exports = router;
