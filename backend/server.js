const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Routes
app.use('/api/clients',   require('./routes/clients'));
app.use('/api/revenue',   require('./routes/revenue'));
app.use('/api/costs',     require('./routes/costs'));
app.use('/api/assets',    require('./routes/assets'));
app.use('/api/liabilities', require('./routes/liabilities'));
app.use('/api/cashflow',  require('./routes/cashflow'));
app.use('/api/kpis',      require('./routes/kpis'));
app.use('/api/notes',     require('./routes/notes'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`FinPlan API running on port ${PORT}`));
