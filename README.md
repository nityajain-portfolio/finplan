# FinPlan — Financial Planning Application

A full-stack financial planning platform for advisors to manage multiple clients,
track revenue, costs, assets, liabilities, cash flow, and KPIs with rich charts.

---

## Project Structure

```
finplan/
├── sql/
│   ├── 01_schema.sql          ← All database tables
│   └── 02_seed_luhadia.sql    ← Sample data for Luhadia Clothing Co.
├── backend/                   ← Node.js / Express REST API
│   ├── server.js
│   ├── config/db.js
│   └── routes/
│       ├── clients.js
│       ├── revenue.js
│       ├── costs.js
│       ├── assets.js
│       ├── liabilities.js
│       ├── cashflow.js
│       ├── kpis.js
│       ├── notes.js
│       └── dashboard.js
├── frontend/                  ← Next.js application
│   ├── pages/
│   │   ├── index.js           ← Client list
│   │   ├── dashboard.js       ← Main dashboard with charts
│   │   ├── revenue.js         ← Revenue deep-dive
│   │   ├── costs.js           ← Cost analysis
│   │   ├── balance-sheet.js   ← Assets & liabilities
│   │   ├── cashflow.js        ← Cash flow waterfall
│   │   ├── kpis.js            ← KPI ratios & radar
│   │   └── notes.js           ← Advisor notes
│   ├── components/
│   │   ├── Layout.js
│   │   ├── Sidebar.js
│   │   ├── KpiCard.js
│   │   ├── PageHeader.js
│   │   └── YearSelector.js
│   └── lib/
│       ├── api.js             ← Axios API calls
│       └── fmt.js             ← Currency / number formatters
└── docs/
    └── DEPLOYMENT.md          ← Local + AWS deployment steps
```

---

## Data Model Summary

| Table | Purpose |
|---|---|
| `clients` | One row per client company |
| `revenue_streams` | Named channels (Wholesale, E-com, etc.) per client |
| `revenue_entries` | Monthly revenue actuals + forecasts |
| `cost_categories` | Fixed / variable cost buckets |
| `cost_entries` | Monthly cost actuals + forecasts |
| `assets` | Current, fixed, intangible assets with depreciation |
| `liabilities` | Current and long-term liabilities with interest |
| `cashflow_entries` | Operating / investing / financing cash movements |
| `kpi_snapshots` | Quarterly ratio snapshots (margins, ratios, EBITDA) |
| `budget_plans` | Annual budget targets |
| `advisor_notes` | Free-form advisor memos categorized by type |

---

## Charts & Visualizations Included

- **Revenue vs Costs vs Profit** — Area chart (monthly, actuals + forecast overlay)
- **Revenue by Channel** — Donut pie + stacked bar
- **Cost by Category** — Horizontal bar chart
- **Fixed vs Variable Costs** — Pie chart
- **Cash Flow Waterfall** — Grouped bar (operating/investing/financing)
- **Cumulative Cash Position** — Line chart
- **Margin Trends** — Multi-line (gross margin, net margin, revenue growth)
- **Liquidity & Leverage** — Dual-line (current ratio, D/E ratio)
- **Financial Health Radar** — Spider chart vs industry benchmarks
- **Balance Sheet Composition** — Pie charts for asset and liability mix

---

## Quick Start

```bash
# 1. Database
mysql -u root -p < sql/01_schema.sql
mysql -u root -p < sql/02_seed_luhadia.sql

# 2. Backend
cd backend && cp .env.example .env  # edit DB credentials
npm install && npm run dev

# 3. Frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
npm install && npm run dev

# Open http://localhost:3000
```

For full AWS EC2 deployment → see docs/DEPLOYMENT.md
