const router = require('express').Router();
const db     = require('../config/db');

// Main dashboard data for a client
router.get('/:clientId', async (req, res) => {
  const clientId = req.params.clientId;
  const year = req.query.year || new Date().getFullYear();

  const [client]       = await db.query('SELECT * FROM clients WHERE id=?', [clientId]);
  const [revMonthly]   = await db.query(`
    SELECT DATE_FORMAT(entry_date,'%b %Y') AS label, DATE_FORMAT(entry_date,'%Y-%m') AS month_key,
           SUM(amount) AS revenue, entry_type
    FROM revenue_entries WHERE client_id=? AND YEAR(entry_date)=?
    GROUP BY month_key, entry_type ORDER BY month_key
  `, [clientId, year]);

  const [costMonthly]  = await db.query(`
    SELECT DATE_FORMAT(entry_date,'%b %Y') AS label, DATE_FORMAT(entry_date,'%Y-%m') AS month_key,
           SUM(amount) AS costs, entry_type
    FROM cost_entries WHERE client_id=? AND YEAR(entry_date)=?
    GROUP BY month_key, entry_type ORDER BY month_key
  `, [clientId, year]);

  const [revenueByStream] = await db.query(`
    SELECT rs.name AS stream, SUM(re.amount) AS total
    FROM revenue_entries re LEFT JOIN revenue_streams rs ON rs.id=re.stream_id
    WHERE re.client_id=? AND re.entry_type='actual' AND YEAR(re.entry_date)=?
    GROUP BY re.stream_id ORDER BY total DESC
  `, [clientId, year]);

  const [costByCategory] = await db.query(`
    SELECT cc.name AS category, cc.cost_type, SUM(ce.amount) AS total
    FROM cost_entries ce LEFT JOIN cost_categories cc ON cc.id=ce.category_id
    WHERE ce.client_id=? AND ce.entry_type='actual' AND YEAR(ce.entry_date)=?
    GROUP BY ce.category_id ORDER BY total DESC
  `, [clientId, year]);

  const [kpis]  = await db.query(`
    SELECT * FROM kpi_snapshots WHERE client_id=? ORDER BY snapshot_date DESC LIMIT 1
  `, [clientId]);

  const [assets] = await db.query(`
    SELECT asset_type, SUM(current_value) AS total FROM assets WHERE client_id=? GROUP BY asset_type
  `, [clientId]);

  const [liabilities] = await db.query(`
    SELECT liability_type, SUM(outstanding_balance) AS total FROM liabilities WHERE client_id=? GROUP BY liability_type
  `, [clientId]);

  const [notes] = await db.query(`
    SELECT * FROM advisor_notes WHERE client_id=? ORDER BY note_date DESC LIMIT 5
  `, [clientId]);

  // Compute totals
  const totalRevActual = revMonthly.filter(r=>r.entry_type==='actual').reduce((s,r)=>s+parseFloat(r.revenue),0);
  const totalCostActual = costMonthly.filter(r=>r.entry_type==='actual').reduce((s,r)=>s+parseFloat(r.costs),0);

  res.json({
    client: client[0],
    summary: {
      totalRevenue: totalRevActual,
      totalCosts:   totalCostActual,
      grossProfit:  totalRevActual - totalCostActual,
      grossMargin:  totalRevActual ? ((totalRevActual - totalCostActual) / totalRevActual) : 0,
    },
    revMonthly,
    costMonthly,
    revenueByStream,
    costByCategory,
    latestKpi:    kpis[0] || null,
    assets,
    liabilities,
    recentNotes:  notes,
  });
});

module.exports = router;
