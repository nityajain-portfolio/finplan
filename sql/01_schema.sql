-- ============================================================
-- FinPlan - Financial Planning Application
-- Schema v1.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS finplan;
USE finplan;

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE clients (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  company_name  VARCHAR(150) NOT NULL,
  industry      VARCHAR(100),
  contact_name  VARCHAR(100),
  contact_email VARCHAR(150),
  contact_phone VARCHAR(30),
  address       TEXT,
  fiscal_year_start TINYINT DEFAULT 1 COMMENT '1=Jan, 4=Apr, 7=Jul, 10=Oct',
  currency      CHAR(3) DEFAULT 'USD',
  status        ENUM('active','inactive','prospect') DEFAULT 'active',
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- REVENUE STREAMS
-- ============================================================
CREATE TABLE revenue_streams (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  client_id   INT NOT NULL,
  name        VARCHAR(150) NOT NULL COMMENT 'e.g. Wholesale, Retail, E-commerce',
  category    VARCHAR(100),
  is_recurring BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- REVENUE ENTRIES  (monthly actuals + forecasts)
-- ============================================================
CREATE TABLE revenue_entries (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  client_id         INT NOT NULL,
  stream_id         INT,
  entry_date        DATE NOT NULL COMMENT 'First day of the month for monthly entries',
  amount            DECIMAL(15,2) NOT NULL,
  entry_type        ENUM('actual','forecast','budget') DEFAULT 'actual',
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (stream_id) REFERENCES revenue_streams(id) ON DELETE SET NULL
);

-- ============================================================
-- COST CATEGORIES
-- ============================================================
CREATE TABLE cost_categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  client_id   INT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  cost_type   ENUM('fixed','variable','semi-variable') NOT NULL,
  parent_id   INT DEFAULT NULL COMMENT 'For subcategories',
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES cost_categories(id) ON DELETE SET NULL
);

-- ============================================================
-- COST ENTRIES  (monthly actuals + forecasts)
-- ============================================================
CREATE TABLE cost_entries (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  client_id     INT NOT NULL,
  category_id   INT,
  entry_date    DATE NOT NULL,
  amount        DECIMAL(15,2) NOT NULL,
  entry_type    ENUM('actual','forecast','budget') DEFAULT 'actual',
  vendor        VARCHAR(150),
  description   TEXT,
  is_recurring  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES cost_categories(id) ON DELETE SET NULL
);

-- ============================================================
-- ASSETS
-- ============================================================
CREATE TABLE assets (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  client_id       INT NOT NULL,
  asset_name      VARCHAR(150) NOT NULL,
  asset_type      ENUM('current','fixed','intangible','investment') NOT NULL,
  purchase_date   DATE,
  purchase_value  DECIMAL(15,2),
  current_value   DECIMAL(15,2),
  depreciation_rate DECIMAL(5,2) COMMENT 'Annual % depreciation',
  notes           TEXT,
  as_of_date      DATE NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- LIABILITIES
-- ============================================================
CREATE TABLE liabilities (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  client_id       INT NOT NULL,
  liability_name  VARCHAR(150) NOT NULL,
  liability_type  ENUM('current','long-term') NOT NULL,
  lender          VARCHAR(150),
  original_amount DECIMAL(15,2),
  outstanding_balance DECIMAL(15,2),
  interest_rate   DECIMAL(5,2),
  start_date      DATE,
  due_date        DATE,
  monthly_payment DECIMAL(15,2),
  notes           TEXT,
  as_of_date      DATE NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- CASH FLOW ENTRIES
-- ============================================================
CREATE TABLE cashflow_entries (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  client_id     INT NOT NULL,
  entry_date    DATE NOT NULL,
  flow_type     ENUM('operating','investing','financing') NOT NULL,
  direction     ENUM('inflow','outflow') NOT NULL,
  amount        DECIMAL(15,2) NOT NULL,
  description   VARCHAR(255),
  entry_type    ENUM('actual','forecast') DEFAULT 'actual',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- KPI / FINANCIAL RATIOS SNAPSHOTS
-- ============================================================
CREATE TABLE kpi_snapshots (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  client_id       INT NOT NULL,
  snapshot_date   DATE NOT NULL,
  gross_margin    DECIMAL(8,4),
  net_margin      DECIMAL(8,4),
  current_ratio   DECIMAL(8,4),
  debt_to_equity  DECIMAL(8,4),
  revenue_growth  DECIMAL(8,4),
  ebitda          DECIMAL(15,2),
  burn_rate       DECIMAL(15,2),
  runway_months   DECIMAL(6,1),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- BUDGET PLANS
-- ============================================================
CREATE TABLE budget_plans (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  client_id     INT NOT NULL,
  plan_name     VARCHAR(150) NOT NULL,
  fiscal_year   INT NOT NULL,
  status        ENUM('draft','approved','active','closed') DEFAULT 'draft',
  total_revenue_budget DECIMAL(15,2),
  total_cost_budget    DECIMAL(15,2),
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- FINANCIAL NOTES / ADVISOR MEMOS
-- ============================================================
CREATE TABLE advisor_notes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  client_id   INT NOT NULL,
  note_date   DATE NOT NULL,
  title       VARCHAR(200),
  body        TEXT,
  category    ENUM('observation','recommendation','risk','opportunity','meeting') DEFAULT 'observation',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_revenue_client_date ON revenue_entries(client_id, entry_date);
CREATE INDEX idx_cost_client_date ON cost_entries(client_id, entry_date);
CREATE INDEX idx_cashflow_client_date ON cashflow_entries(client_id, entry_date);
CREATE INDEX idx_kpi_client_date ON kpi_snapshots(client_id, snapshot_date);
