# FinPlan - Windows Troubleshooting Guide

## STEP 1 — Check what error you actually have

Open two separate Command Prompt / PowerShell windows.

**Terminal 1 (Backend):**
```
cd C:\path\to\finplan\backend
npm run dev
```
Look for: `FinPlan API running on port 4000`
If it crashes, paste the error here.

**Terminal 2 (Frontend):**
```
cd C:\path\to\finplan\frontend
npm run dev
```
Look for: `ready - started server on 0.0.0.0:3000`
If it crashes, paste the error here.

Then open: http://localhost:3000

---

## STEP 2 — Most Common Windows Issues & Fixes

---

### ISSUE A: "npm run dev" crashes immediately — missing .env files

**Backend fix:**
```
cd finplan\backend
copy .env.example .env
```
Then open `.env` in Notepad and fill in your MySQL credentials.

**Frontend fix:**
```
cd finplan\frontend
echo NEXT_PUBLIC_API_URL=http://localhost:4000 > .env.local
```

---

### ISSUE B: Page loads but is completely white / blank

This is usually a JavaScript error in the browser.

1. Press **F12** in Chrome/Edge → click the **Console** tab
2. Look for red error messages
3. Common ones:

**"Cannot read properties of undefined"** → the API call failed.
Fix: Make sure backend is running on port 4000 first.

**"Module not found: Can't resolve '../lib/api'"** → file path issue.
Fix: Make sure you unzipped preserving the folder structure.

---

### ISSUE C: White page, no console errors — Tailwind CSS not loading

The page renders but has no styling (white background, unstyled text).

**Fix:** Replace `styles/globals.css` with this simpler version that
doesn't use @apply (which requires PostCSS to be working):

Delete your current `frontend/styles/globals.css` and replace with the
content in the file: `globals-fixed.css` (included below this guide).

Then restart: `npm run dev`

---

### ISSUE D: Port 3000 already in use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:**
```
# Find and kill whatever is on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port:
set PORT=3001 && npm run dev
```
Then open http://localhost:3001

---

### ISSUE E: Node.js version too old

```
SyntaxError: Cannot use import statement
```

**Fix:** Install Node.js 18 or higher from https://nodejs.org
Choose the **LTS** version. After installing, close all terminals and reopen.

```
node -v    # should show v18.x.x or higher
```

---

### ISSUE F: npm install failed / node_modules missing

```
Cannot find module 'next'
Cannot find module 'express'
```

**Fix:** Run npm install again:
```
cd finplan\backend
npm install

cd ..\frontend
npm install
```

If npm install itself fails with ENOENT or permission errors:
```
# Run as Administrator, or:
npm install --legacy-peer-deps
```

---

### ISSUE G: Backend connects but frontend can't reach it (CORS / network)

The page loads but shows no data / spinning forever.

1. Open http://localhost:4000/health in your browser
   - If it shows `{"status":"ok"}` → backend is fine
   - If it doesn't load → backend isn't running

2. Check your frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
Make sure there is NO trailing slash and NO quotes around the URL.

3. Restart the frontend after changing .env.local:
```
# Stop with Ctrl+C, then:
npm run dev
```

---

### ISSUE H: MySQL connection error in backend

```
Error: connect ECONNREFUSED 127.0.0.1:3306
Access denied for user 'root'@'localhost'
```

**Fix:** Edit `finplan\backend\.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root                  ← your MySQL username
DB_PASSWORD=your_password     ← your MySQL password
DB_NAME=finplan
```

Make sure the `finplan` database exists:
```sql
-- In MySQL Workbench or command line:
CREATE DATABASE IF NOT EXISTS finplan;
USE finplan;
SOURCE C:/path/to/finplan/sql/01_schema.sql;
SOURCE C:/path/to/finplan/sql/02_seed_luhadia.sql;
```

---

## STEP 3 — Clean Reinstall (nuclear option)

If nothing works, do a full clean reinstall:

```
cd finplan\frontend
rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json
npm install
npm run dev
```

```
cd finplan\backend
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

---

## STEP 4 — Verify everything is working

When working correctly you should see:

**Terminal 1 (backend):**
```
FinPlan API running on port 4000
```

**Terminal 2 (frontend):**
```
▲ Next.js 14.1.0
- Local: http://localhost:3000
- ready in Xs
```

**Browser at http://localhost:3000:**
- Dark navy background
- "FinPlan" logo in the sidebar
- "Clients" page showing a card for "Luhadia Clothing Company"
- Clicking it takes you to the Dashboard

---

## STEP 5 — Still not working?

Share the exact error message from:
1. The backend terminal
2. The frontend terminal  
3. The browser console (F12 → Console tab)

That will pinpoint exactly what to fix.
