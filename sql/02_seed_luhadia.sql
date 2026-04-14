-- ============================================================
-- SEED DATA - Luhadia Clothing Company
-- Financial data for 2024 (Jan - Dec) + 2025 YTD
-- ============================================================

USE finplan;

-- ============================================================
-- CLIENT
-- ============================================================
INSERT INTO clients (company_name, industry, contact_name, contact_email, contact_phone, address, fiscal_year_start, currency, status, notes)
VALUES (
  'Luhadia Clothing Company',
  'Apparel & Fashion',
  'Arjun Luhadia',
  'arjun@luhadiaclothing.com',
  '+1-973-555-0182',
  '240 Passaic Ave, Suite 10, Fairfield, NJ 07004',
  1,
  'USD',
  'active',
  'Mid-size clothing brand with wholesale and retail channels. Strong e-commerce growth YoY. Looking to expand into 3 new states by end of 2025.'
);

-- Client ID = 1 (assumed)
SET @c = 1;

-- ============================================================
-- REVENUE STREAMS
-- ============================================================
INSERT INTO revenue_streams (client_id, name, category, is_recurring) VALUES
(@c, 'Wholesale - Department Stores', 'B2B Sales', TRUE),
(@c, 'Retail - Own Stores',           'B2C Sales', TRUE),
(@c, 'E-commerce (Website)',           'Digital Sales', TRUE),
(@c, 'Amazon / Marketplace',           'Digital Sales', TRUE),
(@c, 'Private Label Contracts',        'B2B Sales', FALSE);

-- stream IDs assumed 1..5

-- ============================================================
-- COST CATEGORIES
-- ============================================================
INSERT INTO cost_categories (client_id, name, cost_type) VALUES
(@c, 'Cost of Goods Sold (COGS)',   'variable'),    -- 1
(@c, 'Salaries & Wages',            'fixed'),        -- 2
(@c, 'Rent & Facilities',           'fixed'),        -- 3
(@c, 'Marketing & Advertising',     'variable'),     -- 4
(@c, 'Logistics & Shipping',        'variable'),     -- 5
(@c, 'Technology & Software',       'fixed'),        -- 6
(@c, 'Insurance',                   'fixed'),        -- 7
(@c, 'Utilities',                   'semi-variable'),-- 8
(@c, 'Legal & Professional Fees',   'semi-variable'),-- 9
(@c, 'Depreciation',                'fixed'),        -- 10
(@c, 'Loan Interest',               'fixed'),        -- 11
(@c, 'Miscellaneous / Other',       'variable');     -- 12

-- ============================================================
-- REVENUE ENTRIES  2024 (actual)
-- Each month: Wholesale + Retail + Ecom + Amazon + PrivateLabel
-- ============================================================

-- JAN 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-01-01',185000,'actual'),
(@c,2,'2024-01-01',62000,'actual'),
(@c,3,'2024-01-01',44000,'actual'),
(@c,4,'2024-01-01',28000,'actual'),
(@c,5,'2024-01-01',15000,'actual');

-- FEB 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-02-01',172000,'actual'),
(@c,2,'2024-02-01',55000,'actual'),
(@c,3,'2024-02-01',49000,'actual'),
(@c,4,'2024-02-01',31000,'actual'),
(@c,5,'2024-02-01',0,'actual');

-- MAR 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-03-01',198000,'actual'),
(@c,2,'2024-03-01',68000,'actual'),
(@c,3,'2024-03-01',57000,'actual'),
(@c,4,'2024-03-01',34000,'actual'),
(@c,5,'2024-03-01',22000,'actual');

-- APR 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-04-01',210000,'actual'),
(@c,2,'2024-04-01',71000,'actual'),
(@c,3,'2024-04-01',63000,'actual'),
(@c,4,'2024-04-01',39000,'actual'),
(@c,5,'2024-04-01',0,'actual');

-- MAY 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-05-01',225000,'actual'),
(@c,2,'2024-05-01',78000,'actual'),
(@c,3,'2024-05-01',71000,'actual'),
(@c,4,'2024-05-01',43000,'actual'),
(@c,5,'2024-05-01',18000,'actual');

-- JUN 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-06-01',215000,'actual'),
(@c,2,'2024-06-01',74000,'actual'),
(@c,3,'2024-06-01',68000,'actual'),
(@c,4,'2024-06-01',41000,'actual'),
(@c,5,'2024-06-01',0,'actual');

-- JUL 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-07-01',195000,'actual'),
(@c,2,'2024-07-01',66000,'actual'),
(@c,3,'2024-07-01',75000,'actual'),
(@c,4,'2024-07-01',48000,'actual'),
(@c,5,'2024-07-01',25000,'actual');

-- AUG 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-08-01',205000,'actual'),
(@c,2,'2024-08-01',69000,'actual'),
(@c,3,'2024-08-01',82000,'actual'),
(@c,4,'2024-08-01',52000,'actual'),
(@c,5,'2024-08-01',0,'actual');

-- SEP 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-09-01',235000,'actual'),
(@c,2,'2024-09-01',80000,'actual'),
(@c,3,'2024-09-01',90000,'actual'),
(@c,4,'2024-09-01',57000,'actual'),
(@c,5,'2024-09-01',30000,'actual');

-- OCT 2024
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-10-01',262000,'actual'),
(@c,2,'2024-10-01',93000,'actual'),
(@c,3,'2024-10-01',105000,'actual'),
(@c,4,'2024-10-01',67000,'actual'),
(@c,5,'2024-10-01',20000,'actual');

-- NOV 2024  (holiday season spike)
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-11-01',290000,'actual'),
(@c,2,'2024-11-01',115000,'actual'),
(@c,3,'2024-11-01',142000,'actual'),
(@c,4,'2024-11-01',98000,'actual'),
(@c,5,'2024-11-01',0,'actual');

-- DEC 2024  (peak holiday)
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2024-12-01',315000,'actual'),
(@c,2,'2024-12-01',128000,'actual'),
(@c,3,'2024-12-01',165000,'actual'),
(@c,4,'2024-12-01',112000,'actual'),
(@c,5,'2024-12-01',35000,'actual');

-- 2025 JAN-MAR (actual) + APR-DEC (forecast)
INSERT INTO revenue_entries (client_id, stream_id, entry_date, amount, entry_type) VALUES
(@c,1,'2025-01-01',200000,'actual'),(@c,2,'2025-01-01',70000,'actual'),(@c,3,'2025-01-01',85000,'actual'),(@c,4,'2025-01-01',55000,'actual'),(@c,5,'2025-01-01',20000,'actual'),
(@c,1,'2025-02-01',188000,'actual'),(@c,2,'2025-02-01',64000,'actual'),(@c,3,'2025-02-01',91000,'actual'),(@c,4,'2025-02-01',59000,'actual'),(@c,5,'2025-02-01',0,'actual'),
(@c,1,'2025-03-01',215000,'actual'),(@c,2,'2025-03-01',75000,'actual'),(@c,3,'2025-03-01',98000,'actual'),(@c,4,'2025-03-01',64000,'actual'),(@c,5,'2025-03-01',28000,'actual'),
(@c,1,'2025-04-01',228000,'forecast'),(@c,2,'2025-04-01',80000,'forecast'),(@c,3,'2025-04-01',105000,'forecast'),(@c,4,'2025-04-01',69000,'forecast'),(@c,5,'2025-04-01',0,'forecast'),
(@c,1,'2025-05-01',242000,'forecast'),(@c,2,'2025-05-01',85000,'forecast'),(@c,3,'2025-05-01',112000,'forecast'),(@c,4,'2025-05-01',73000,'forecast'),(@c,5,'2025-05-01',22000,'forecast'),
(@c,1,'2025-06-01',235000,'forecast'),(@c,2,'2025-06-01',82000,'forecast'),(@c,3,'2025-06-01',108000,'forecast'),(@c,4,'2025-06-01',71000,'forecast'),(@c,5,'2025-06-01',0,'forecast'),
(@c,1,'2025-07-01',218000,'forecast'),(@c,2,'2025-07-01',76000,'forecast'),(@c,3,'2025-07-01',118000,'forecast'),(@c,4,'2025-04-01',78000,'forecast'),(@c,5,'2025-07-01',30000,'forecast'),
(@c,1,'2025-08-01',228000,'forecast'),(@c,2,'2025-08-01',79000,'forecast'),(@c,3,'2025-08-01',125000,'forecast'),(@c,4,'2025-08-01',82000,'forecast'),(@c,5,'2025-08-01',0,'forecast'),
(@c,1,'2025-09-01',255000,'forecast'),(@c,2,'2025-09-01',88000,'forecast'),(@c,3,'2025-09-01',135000,'forecast'),(@c,4,'2025-09-01',90000,'forecast'),(@c,5,'2025-09-01',35000,'forecast'),
(@c,1,'2025-10-01',285000,'forecast'),(@c,2,'2025-10-01',100000,'forecast'),(@c,3,'2025-10-01',158000,'forecast'),(@c,4,'2025-10-01',105000,'forecast'),(@c,5,'2025-10-01',25000,'forecast'),
(@c,1,'2025-11-01',318000,'forecast'),(@c,2,'2025-11-01',128000,'forecast'),(@c,3,'2025-11-01',195000,'forecast'),(@c,4,'2025-11-01',135000,'forecast'),(@c,5,'2025-11-01',0,'forecast'),
(@c,1,'2025-12-01',345000,'forecast'),(@c,2,'2025-12-01',142000,'forecast'),(@c,3,'2025-12-01',225000,'forecast'),(@c,4,'2025-12-01',155000,'forecast'),(@c,5,'2025-12-01',42000,'forecast');

-- ============================================================
-- COST ENTRIES  2024 (monthly)
-- ============================================================

-- Helper: insert costs for each month
-- COGS ~38% of revenue, Salaries fixed, Rent fixed, etc.

INSERT INTO cost_entries (client_id, category_id, entry_date, amount, entry_type, description, is_recurring) VALUES
-- JAN 2024
(@c,1,'2024-01-01',127400,'actual','Cost of Goods Sold',FALSE),
(@c,2,'2024-01-01',62000,'actual','Staff salaries',TRUE),
(@c,3,'2024-01-01',18500,'actual','Warehouse + office rent',TRUE),
(@c,4,'2024-01-01',22000,'actual','Digital ads + trade shows',FALSE),
(@c,5,'2024-01-01',18200,'actual','Outbound shipping & 3PL',FALSE),
(@c,6,'2024-01-01',4800,'actual','Shopify, ERP, design tools',TRUE),
(@c,7,'2024-01-01',3200,'actual','Business insurance',TRUE),
(@c,8,'2024-01-01',2100,'actual','Electricity, water',TRUE),
(@c,9,'2024-01-01',5500,'actual','CPA / legal retainer',TRUE),
(@c,10,'2024-01-01',4200,'actual','Equipment depreciation',TRUE),
(@c,11,'2024-01-01',6800,'actual','Term loan interest',TRUE),
(@c,12,'2024-01-01',3200,'actual','Miscellaneous',FALSE),

-- FEB 2024
(@c,1,'2024-02-01',117200,'actual','COGS',FALSE),
(@c,2,'2024-02-01',62000,'actual','Staff salaries',TRUE),
(@c,3,'2024-02-01',18500,'actual','Rent',TRUE),
(@c,4,'2024-02-01',18000,'actual','Advertising',FALSE),
(@c,5,'2024-02-01',16800,'actual','Shipping',FALSE),
(@c,6,'2024-02-01',4800,'actual','Software',TRUE),
(@c,7,'2024-02-01',3200,'actual','Insurance',TRUE),
(@c,8,'2024-02-01',2100,'actual','Utilities',TRUE),
(@c,9,'2024-02-01',5500,'actual','Professional fees',TRUE),
(@c,10,'2024-02-01',4200,'actual','Depreciation',TRUE),
(@c,11,'2024-02-01',6800,'actual','Loan interest',TRUE),
(@c,12,'2024-02-01',2800,'actual','Misc',FALSE),

-- MAR 2024
(@c,1,'2024-03-01',136200,'actual','COGS',FALSE),
(@c,2,'2024-03-01',62000,'actual','Salaries',TRUE),
(@c,3,'2024-03-01',18500,'actual','Rent',TRUE),
(@c,4,'2024-03-01',24000,'actual','Spring campaign launch',FALSE),
(@c,5,'2024-03-01',19500,'actual','Shipping',FALSE),
(@c,6,'2024-03-01',4800,'actual','Software',TRUE),
(@c,7,'2024-03-01',3200,'actual','Insurance',TRUE),
(@c,8,'2024-03-01',2100,'actual','Utilities',TRUE),
(@c,9,'2024-03-01',5500,'actual','Professional fees',TRUE),
(@c,10,'2024-03-01',4200,'actual','Depreciation',TRUE),
(@c,11,'2024-03-01',6800,'actual','Loan interest',TRUE),
(@c,12,'2024-03-01',3500,'actual','Misc',FALSE),

-- APR-DEC 2024 (condensed)
(@c,1,'2024-04-01',145200,'actual','COGS',FALSE),(@c,2,'2024-04-01',65000,'actual','Salaries (new hire)',TRUE),(@c,3,'2024-04-01',18500,'actual','Rent',TRUE),(@c,4,'2024-04-01',26000,'actual','Ads',FALSE),(@c,5,'2024-04-01',20800,'actual','Shipping',FALSE),(@c,6,'2024-04-01',4800,'actual','SW',TRUE),(@c,7,'2024-04-01',3200,'actual','Ins',TRUE),(@c,8,'2024-04-01',2200,'actual','Util',TRUE),(@c,9,'2024-04-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-04-01',4200,'actual','Depr',TRUE),(@c,11,'2024-04-01',6800,'actual','Interest',TRUE),(@c,12,'2024-04-01',4100,'actual','Misc',FALSE),

(@c,1,'2024-05-01',155500,'actual','COGS',FALSE),(@c,2,'2024-05-01',65000,'actual','Salaries',TRUE),(@c,3,'2024-05-01',18500,'actual','Rent',TRUE),(@c,4,'2024-05-01',28000,'actual','Ads',FALSE),(@c,5,'2024-05-01',22100,'actual','Shipping',FALSE),(@c,6,'2024-05-01',4800,'actual','SW',TRUE),(@c,7,'2024-05-01',3200,'actual','Ins',TRUE),(@c,8,'2024-05-01',2200,'actual','Util',TRUE),(@c,9,'2024-05-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-05-01',4200,'actual','Depr',TRUE),(@c,11,'2024-05-01',6800,'actual','Interest',TRUE),(@c,12,'2024-05-01',3800,'actual','Misc',FALSE),

(@c,1,'2024-06-01',148800,'actual','COGS',FALSE),(@c,2,'2024-06-01',65000,'actual','Salaries',TRUE),(@c,3,'2024-06-01',18500,'actual','Rent',TRUE),(@c,4,'2024-06-01',24000,'actual','Ads',FALSE),(@c,5,'2024-06-01',21200,'actual','Shipping',FALSE),(@c,6,'2024-06-01',4800,'actual','SW',TRUE),(@c,7,'2024-06-01',3200,'actual','Ins',TRUE),(@c,8,'2024-06-01',2400,'actual','Util',TRUE),(@c,9,'2024-06-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-06-01',4200,'actual','Depr',TRUE),(@c,11,'2024-06-01',6800,'actual','Interest',TRUE),(@c,12,'2024-06-01',3200,'actual','Misc',FALSE),

(@c,1,'2024-07-01',139300,'actual','COGS',FALSE),(@c,2,'2024-07-01',65000,'actual','Salaries',TRUE),(@c,3,'2024-07-01',18500,'actual','Rent',TRUE),(@c,4,'2024-07-01',22000,'actual','Ads',FALSE),(@c,5,'2024-07-01',19800,'actual','Shipping',FALSE),(@c,6,'2024-07-01',4800,'actual','SW',TRUE),(@c,7,'2024-07-01',3200,'actual','Ins',TRUE),(@c,8,'2024-07-01',2400,'actual','Util',TRUE),(@c,9,'2024-07-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-07-01',4200,'actual','Depr',TRUE),(@c,11,'2024-07-01',6800,'actual','Interest',TRUE),(@c,12,'2024-07-01',2900,'actual','Misc',FALSE),

(@c,1,'2024-08-01',147400,'actual','COGS',FALSE),(@c,2,'2024-08-01',65000,'actual','Salaries',TRUE),(@c,3,'2024-08-01',18500,'actual','Rent',TRUE),(@c,4,'2024-08-01',24000,'actual','Fall campaign',FALSE),(@c,5,'2024-08-01',20600,'actual','Shipping',FALSE),(@c,6,'2024-08-01',4800,'actual','SW',TRUE),(@c,7,'2024-08-01',3200,'actual','Ins',TRUE),(@c,8,'2024-08-01',2300,'actual','Util',TRUE),(@c,9,'2024-08-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-08-01',4200,'actual','Depr',TRUE),(@c,11,'2024-08-01',6800,'actual','Interest',TRUE),(@c,12,'2024-08-01',3100,'actual','Misc',FALSE),

(@c,1,'2024-09-01',166800,'actual','COGS',FALSE),(@c,2,'2024-09-01',65000,'actual','Salaries',TRUE),(@c,3,'2024-09-01',18500,'actual','Rent',TRUE),(@c,4,'2024-09-01',30000,'actual','Holiday pre-campaign',FALSE),(@c,5,'2024-09-01',23400,'actual','Shipping',FALSE),(@c,6,'2024-09-01',4800,'actual','SW',TRUE),(@c,7,'2024-09-01',3200,'actual','Ins',TRUE),(@c,8,'2024-09-01',2200,'actual','Util',TRUE),(@c,9,'2024-09-01',7500,'actual','Tax planning',FALSE),(@c,10,'2024-09-01',4200,'actual','Depr',TRUE),(@c,11,'2024-09-01',6800,'actual','Interest',TRUE),(@c,12,'2024-09-01',3400,'actual','Misc',FALSE),

(@c,1,'2024-10-01',187200,'actual','COGS',FALSE),(@c,2,'2024-10-01',65000,'actual','Salaries',TRUE),(@c,3,'2024-10-01',18500,'actual','Rent',TRUE),(@c,4,'2024-10-01',38000,'actual','Holiday campaign',FALSE),(@c,5,'2024-10-01',27200,'actual','Shipping',FALSE),(@c,6,'2024-10-01',4800,'actual','SW',TRUE),(@c,7,'2024-10-01',3200,'actual','Ins',TRUE),(@c,8,'2024-10-01',2200,'actual','Util',TRUE),(@c,9,'2024-10-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-10-01',4200,'actual','Depr',TRUE),(@c,11,'2024-10-01',6800,'actual','Interest',TRUE),(@c,12,'2024-10-01',4500,'actual','Misc',FALSE),

(@c,1,'2024-11-01',218400,'actual','COGS',FALSE),(@c,2,'2024-11-01',72000,'actual','Salaries + seasonal',TRUE),(@c,3,'2024-11-01',18500,'actual','Rent',TRUE),(@c,4,'2024-11-01',48000,'actual','Black Friday push',FALSE),(@c,5,'2024-11-01',35600,'actual','Shipping spike',FALSE),(@c,6,'2024-11-01',4800,'actual','SW',TRUE),(@c,7,'2024-11-01',3200,'actual','Ins',TRUE),(@c,8,'2024-11-01',2500,'actual','Util',TRUE),(@c,9,'2024-11-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-11-01',4200,'actual','Depr',TRUE),(@c,11,'2024-11-01',6800,'actual','Interest',TRUE),(@c,12,'2024-11-01',5200,'actual','Misc',FALSE),

(@c,1,'2024-12-01',246400,'actual','COGS',FALSE),(@c,2,'2024-12-01',72000,'actual','Salaries + seasonal',TRUE),(@c,3,'2024-12-01',18500,'actual','Rent',TRUE),(@c,4,'2024-12-01',42000,'actual','December ads',FALSE),(@c,5,'2024-12-01',41200,'actual','Peak shipping',FALSE),(@c,6,'2024-12-01',4800,'actual','SW',TRUE),(@c,7,'2024-12-01',3200,'actual','Ins',TRUE),(@c,8,'2024-12-01',2500,'actual','Util',TRUE),(@c,9,'2024-12-01',5500,'actual','Prof fees',TRUE),(@c,10,'2024-12-01',4200,'actual','Depr',TRUE),(@c,11,'2024-12-01',6800,'actual','Interest',TRUE),(@c,12,'2024-12-01',5800,'actual','Misc',FALSE);

-- 2025 Q1 Actuals
INSERT INTO cost_entries (client_id, category_id, entry_date, amount, entry_type, description, is_recurring) VALUES
(@c,1,'2025-01-01',152000,'actual','COGS',FALSE),(@c,2,'2025-01-01',68000,'actual','Salaries',TRUE),(@c,3,'2025-01-01',19200,'actual','Rent (new lease)',TRUE),(@c,4,'2025-01-01',28000,'actual','Ads',FALSE),(@c,5,'2025-01-01',24200,'actual','Shipping',FALSE),(@c,6,'2025-01-01',5200,'actual','SW',TRUE),(@c,7,'2025-01-01',3400,'actual','Ins',TRUE),(@c,8,'2025-01-01',2300,'actual','Util',TRUE),(@c,9,'2025-01-01',5500,'actual','Prof fees',TRUE),(@c,10,'2025-01-01',4500,'actual','Depr',TRUE),(@c,11,'2025-01-01',6200,'actual','Interest (refinanced)',TRUE),(@c,12,'2025-01-01',3800,'actual','Misc',FALSE),
(@c,1,'2025-02-01',144200,'actual','COGS',FALSE),(@c,2,'2025-02-01',68000,'actual','Salaries',TRUE),(@c,3,'2025-02-01',19200,'actual','Rent',TRUE),(@c,4,'2025-02-01',22000,'actual','Ads',FALSE),(@c,5,'2025-02-01',22600,'actual','Shipping',FALSE),(@c,6,'2025-02-01',5200,'actual','SW',TRUE),(@c,7,'2025-02-01',3400,'actual','Ins',TRUE),(@c,8,'2025-02-01',2300,'actual','Util',TRUE),(@c,9,'2025-02-01',5500,'actual','Prof fees',TRUE),(@c,10,'2025-02-01',4500,'actual','Depr',TRUE),(@c,11,'2025-02-01',6200,'actual','Interest',TRUE),(@c,12,'2025-02-01',3200,'actual','Misc',FALSE),
(@c,1,'2025-03-01',162400,'actual','COGS',FALSE),(@c,2,'2025-03-01',68000,'actual','Salaries',TRUE),(@c,3,'2025-03-01',19200,'actual','Rent',TRUE),(@c,4,'2025-03-01',28000,'actual','Spring ads',FALSE),(@c,5,'2025-03-01',25800,'actual','Shipping',FALSE),(@c,6,'2025-03-01',5200,'actual','SW',TRUE),(@c,7,'2025-03-01',3400,'actual','Ins',TRUE),(@c,8,'2025-03-01',2300,'actual','Util',TRUE),(@c,9,'2025-03-01',5500,'actual','Prof fees',TRUE),(@c,10,'2025-03-01',4500,'actual','Depr',TRUE),(@c,11,'2025-03-01',6200,'actual','Interest',TRUE),(@c,12,'2025-03-01',4200,'actual','Misc',FALSE);

-- ============================================================
-- ASSETS
-- ============================================================
INSERT INTO assets (client_id, asset_name, asset_type, purchase_date, purchase_value, current_value, depreciation_rate, as_of_date) VALUES
(@c,'Cash & Bank Balances',       'current',  NULL,         NULL,    285000,  NULL, '2025-03-31'),
(@c,'Accounts Receivable',        'current',  NULL,         NULL,    198000,  NULL, '2025-03-31'),
(@c,'Inventory - Finished Goods', 'current',  NULL,         NULL,    342000,  NULL, '2025-03-31'),
(@c,'Inventory - Raw Materials',  'current',  NULL,         NULL,    88000,   NULL, '2025-03-31'),
(@c,'Prepaid Expenses',           'current',  NULL,         NULL,    24000,   NULL, '2025-03-31'),
(@c,'Warehouse Equipment',        'fixed',    '2021-06-01', 185000,  95000,   12.5, '2025-03-31'),
(@c,'Sewing Machines (12 units)', 'fixed',    '2022-03-01', 96000,   62400,   15.0, '2025-03-31'),
(@c,'Delivery Vehicles (2)',      'fixed',    '2023-01-01', 78000,   54600,   20.0, '2025-03-31'),
(@c,'Retail Store Fit-out',       'fixed',    '2020-09-01', 145000,  58000,   10.0, '2025-03-31'),
(@c,'Brand IP / Trademarks',      'intangible','2019-01-01', 50000,   50000,   NULL, '2025-03-31'),
(@c,'E-commerce Platform (custom)','intangible','2022-07-01',38000,   22800,   20.0, '2025-03-31');

-- ============================================================
-- LIABILITIES
-- ============================================================
INSERT INTO liabilities (client_id, liability_name, liability_type, lender, original_amount, outstanding_balance, interest_rate, start_date, due_date, monthly_payment, as_of_date) VALUES
(@c,'Accounts Payable',            'current',  'Various Suppliers',          NULL,    145000,  NULL, NULL,         NULL,         NULL,    '2025-03-31'),
(@c,'Accrued Payroll',             'current',  NULL,                         NULL,    34000,   NULL, NULL,         '2025-04-15', NULL,    '2025-03-31'),
(@c,'Sales Tax Payable',           'current',  'NJ Division of Taxation',    NULL,    18200,   NULL, NULL,         '2025-04-20', NULL,    '2025-03-31'),
(@c,'Short-term Loan (Line of Credit)','current','Wells Fargo',              150000,  85000,   7.25, '2023-06-01', '2025-12-31', 7200,   '2025-03-31'),
(@c,'Term Loan - Expansion',       'long-term','TD Bank',                    500000,  388000,  5.80, '2021-03-01', '2028-03-01', 8200,   '2025-03-31'),
(@c,'Equipment Financing',         'long-term','Caterpillar Financial',       96000,   52000,   6.50, '2022-03-01', '2027-03-01', 1850,   '2025-03-31'),
(@c,'Deferred Revenue',            'current',  NULL,                         NULL,    22000,   NULL, NULL,         NULL,         NULL,    '2025-03-31');

-- ============================================================
-- CASH FLOW ENTRIES  (sample quarters)
-- ============================================================
INSERT INTO cashflow_entries (client_id, entry_date, flow_type, direction, amount, description, entry_type) VALUES
-- Q1 2024
(@c,'2024-01-01','operating','inflow',  334000,'Collections from customers','actual'),
(@c,'2024-01-01','operating','outflow', 270200,'Payments to suppliers & staff','actual'),
(@c,'2024-02-01','operating','inflow',  307000,'Collections','actual'),
(@c,'2024-02-01','operating','outflow', 253400,'Payments','actual'),
(@c,'2024-03-01','operating','inflow',  379000,'Collections','actual'),
(@c,'2024-03-01','operating','outflow', 293800,'Payments','actual'),
-- Q4 2024 (peak)
(@c,'2024-10-01','operating','inflow',  547000,'Collections - holiday season','actual'),
(@c,'2024-10-01','operating','outflow', 367100,'Payments','actual'),
(@c,'2024-11-01','operating','inflow',  645000,'Black Friday / Cyber Monday','actual'),
(@c,'2024-11-01','operating','outflow', 424400,'Payments','actual'),
(@c,'2024-12-01','operating','inflow',  755000,'December peak','actual'),
(@c,'2024-12-01','operating','outflow', 457700,'Payments','actual'),
-- Investing
(@c,'2024-03-15','investing','outflow', 28000,'New embroidery machine','actual'),
(@c,'2024-09-10','investing','outflow', 42000,'Retail store renovation','actual'),
-- Financing
(@c,'2024-01-01','financing','outflow', 8200,'Term loan principal payment','actual'),
(@c,'2024-01-01','financing','outflow', 6800,'Loan interest','actual'),
(@c,'2024-06-15','financing','inflow',  85000,'Line of credit drawdown','actual'),
(@c,'2024-11-01','financing','outflow', 15200,'Line of credit partial repayment','actual'),
-- 2025 Q1
(@c,'2025-01-01','operating','inflow',  430000,'Collections','actual'),
(@c,'2025-01-01','operating','outflow', 322400,'Payments','actual'),
(@c,'2025-02-01','operating','inflow',  402000,'Collections','actual'),
(@c,'2025-02-01','operating','outflow', 306100,'Payments','actual'),
(@c,'2025-03-01','operating','inflow',  480000,'Collections','actual'),
(@c,'2025-03-01','operating','outflow', 338300,'Payments','actual'),
(@c,'2025-01-01','financing','outflow', 8200,'Term loan payment','actual'),
(@c,'2025-02-01','financing','outflow', 8200,'Term loan payment','actual'),
(@c,'2025-03-01','financing','outflow', 8200,'Term loan payment','actual');

-- ============================================================
-- KPI SNAPSHOTS  (quarterly)
-- ============================================================
INSERT INTO kpi_snapshots (client_id, snapshot_date, gross_margin, net_margin, current_ratio, debt_to_equity, revenue_growth, ebitda, burn_rate, runway_months) VALUES
(@c,'2024-03-31', 0.3812, 0.0924, 1.45, 1.28, NULL,    87400,  NULL, NULL),
(@c,'2024-06-30', 0.3891, 0.0988, 1.52, 1.21, 0.1145,  95200,  NULL, NULL),
(@c,'2024-09-30', 0.3945, 0.1032, 1.61, 1.15, 0.1390, 108600,  NULL, NULL),
(@c,'2024-12-31', 0.3978, 0.1108, 1.74, 1.08, 0.1685, 142800,  NULL, NULL),
(@c,'2025-03-31', 0.4010, 0.1145, 1.82, 0.98, 0.1920, 118200,  NULL, NULL);

-- ============================================================
-- BUDGET PLAN 2025
-- ============================================================
INSERT INTO budget_plans (client_id, plan_name, fiscal_year, status, total_revenue_budget, total_cost_budget, notes) VALUES
(@c,'FY2025 Growth Plan',2025,'active',3850000,3080000,'Targeting 15% YoY revenue growth. New store opening in Q3. Digital ad spend up 20%.');

-- ============================================================
-- ADVISOR NOTES
-- ============================================================
INSERT INTO advisor_notes (client_id, note_date, title, body, category) VALUES
(@c,'2025-01-15','Q4 2024 Performance Review','Luhadia Clothing had an exceptional Q4 2024. Revenue hit $755K in December alone — a 17% increase over Dec 2023. Gross margins improved to 39.7% driven by better supplier terms negotiated in Q3. Recommend locking in current supplier contracts for 18 months.','observation'),
(@c,'2025-01-15','Debt Reduction Priority','Outstanding term loan balance at $388K with 5.8% rate. With strong cash position post-holiday season, recommend an additional $50K principal payment in Q1 2025 to reduce interest burden and improve D/E ratio below 0.90 by year-end.','recommendation'),
(@c,'2025-02-10','E-commerce Growth Opportunity','E-commerce revenue has grown from $44K/mo (Jan 2024) to projected $225K/mo (Dec 2025). This channel now merits dedicated investment. Suggest hiring a digital marketing manager and increasing ad spend by $8K/mo starting Q2 2025.','opportunity'),
(@c,'2025-02-10','Inventory Risk — Raw Materials','Raw material inventory at $88K is below the 12-week safety threshold given current production pace. Recommend increasing safety stock to $125K to avoid stockouts during peak season.','risk'),
(@c,'2025-03-20','Q1 2025 Interim Review','Revenue tracking 8% ahead of budget through March. EBITDA margin at 11.45% vs 10.5% target. Cash position strong at $285K. On track for FY2025 plan. No major concerns — focus next quarter on the new store buildout timeline.','meeting');
