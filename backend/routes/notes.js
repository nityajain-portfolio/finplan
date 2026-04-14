const router = require('express').Router();
const db     = require('../config/db');
router.get('/:clientId', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM advisor_notes WHERE client_id = ? ORDER BY note_date DESC', [req.params.clientId]);
  res.json(rows);
});
router.post('/:clientId', async (req, res) => {
  const { note_date, title, body, category } = req.body;
  const [r] = await db.query(
    `INSERT INTO advisor_notes (client_id,note_date,title,body,category) VALUES (?,?,?,?,?)`,
    [req.params.clientId, note_date, title, body, category||'observation']
  );
  res.json({ id: r.insertId });
});
module.exports = router;
