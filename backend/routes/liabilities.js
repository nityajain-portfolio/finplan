const router = require('express').Router();
const db     = require('../config/db');
router.get('/:clientId', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM liabilities WHERE client_id = ? ORDER BY liability_type, liability_name', [req.params.clientId]);
  res.json(rows);
});
router.post('/:clientId', async (req, res) => {
  const { liability_name, liability_type, lender, original_amount, outstanding_balance, interest_rate, start_date, due_date, monthly_payment, as_of_date, notes } = req.body;
  const [r] = await db.query(
    `INSERT INTO liabilities (client_id,liability_name,liability_type,lender,original_amount,outstanding_balance,interest_rate,start_date,due_date,monthly_payment,as_of_date,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [req.params.clientId, liability_name, liability_type, lender, original_amount, outstanding_balance, interest_rate, start_date, due_date, monthly_payment, as_of_date, notes]
  );
  res.json({ id: r.insertId });
});
module.exports = router;
