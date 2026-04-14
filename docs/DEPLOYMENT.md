# FinPlan – Full Deployment Guide
## Local (Windows) → AWS EC2 + MySQL

---

## PART 1 · LOCAL SETUP (Windows PC)

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- MySQL already running locally or remotely
- Git (optional but recommended)

---

### Step 1 · Set Up the Database

Open MySQL Workbench or your MySQL client and run:

```sql
-- 1. Create the database
CREATE DATABASE finplan;

-- 2. Run the schema
SOURCE C:/path/to/finplan/sql/01_schema.sql;

-- 3. Run the seed data for Luhadia Clothing
SOURCE C:/path/to/finplan/sql/02_seed_luhadia.sql;
```

Or from command line:
```bash
mysql -u root -p < sql/01_schema.sql
mysql -u root -p < sql/02_seed_luhadia.sql
```

---

### Step 2 · Configure & Start the Backend

```bash
cd finplan/backend
npm install

# Copy and edit your env file
copy .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=finplan
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Start:
```bash
npm run dev
# API running at http://localhost:4000
# Test: http://localhost:4000/health
```

---

### Step 3 · Configure & Start the Frontend

```bash
cd finplan/frontend
npm install

# Create env file
echo NEXT_PUBLIC_API_URL=http://localhost:4000 > .env.local

npm run dev
# App running at http://localhost:3000
```

Open http://localhost:3000 — you should see "Luhadia Clothing Company" in the client list.

---

## PART 2 · AWS EC2 DEPLOYMENT

### Architecture
```
Internet → EC2 (Nginx reverse proxy)
               ├─ :3000 → Next.js (PM2)
               └─ :4000 → Express API (PM2)
           → RDS MySQL  (or EC2-hosted MySQL)
```

---

### Step 1 · Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. **AMI**: Ubuntu Server 22.04 LTS (free tier eligible)
3. **Instance type**: t3.small (2GB RAM recommended, t2.micro for testing)
4. **Key pair**: Create or use existing .pem file
5. **Security Group** — open these ports:
   - SSH: 22 (your IP only)
   - HTTP: 80 (0.0.0.0/0)
   - HTTPS: 443 (0.0.0.0/0)
   - Custom TCP 4000 (your IP only, for direct API testing)
6. **Storage**: 20GB gp3
7. Launch the instance

---

### Step 2 · Connect & Install Dependencies

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install MySQL client (if DB is on RDS)
sudo apt install -y mysql-client

# Verify
node -v   # should be 18.x
npm -v
pm2 -v
```

---

### Step 3 · Set Up Your MySQL Database on AWS

**Option A: AWS RDS (Recommended for production)**
1. Go to RDS → Create database → MySQL 8.0
2. Free tier eligible: db.t3.micro
3. Set master username + password
4. Make it publicly accessible OR put it in same VPC as EC2
5. Add EC2 security group to RDS inbound rules (port 3306)
6. Note the RDS endpoint URL

**Option B: Use your existing MySQL**
- Make sure your existing MySQL accepts connections from the EC2 IP
- Add EC2's public IP to MySQL's allowed hosts
- Update firewall/security group on your MySQL server

**Run SQL scripts against your RDS/MySQL:**
```bash
mysql -h YOUR_RDS_ENDPOINT -u admin -p finplan < sql/01_schema.sql
mysql -h YOUR_RDS_ENDPOINT -u admin -p finplan < sql/02_seed_luhadia.sql
```

---

### Step 4 · Upload Your Code to EC2

**Option A: Git (Recommended)**
```bash
# On EC2
sudo apt install -y git
git clone https://github.com/YOUR_USERNAME/finplan.git /home/ubuntu/finplan
```

**Option B: SCP from Windows**
```bash
# On Windows PowerShell
scp -i your-key.pem -r C:\path\to\finplan ubuntu@YOUR_EC2_IP:/home/ubuntu/finplan
```

**Option B: WinSCP**
- Download WinSCP, connect with your .pem key, drag-and-drop the folder.

---

### Step 5 · Configure Backend on EC2

```bash
cd /home/ubuntu/finplan/backend
npm install --production

# Create .env
nano .env
```

Paste:
```
DB_HOST=YOUR_RDS_ENDPOINT_OR_MYSQL_HOST
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=finplan
PORT=4000
NODE_ENV=production
CORS_ORIGIN=http://YOUR_EC2_PUBLIC_IP
```

Test it starts:
```bash
node server.js
# Should say: FinPlan API running on port 4000
# Ctrl+C to stop
```

---

### Step 6 · Configure Frontend on EC2

```bash
cd /home/ubuntu/finplan/frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://YOUR_EC2_PUBLIC_IP/api-proxy" > .env.local
# Or use internal:
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# Build for production
npm run build
```

---

### Step 7 · Start Both Apps with PM2

```bash
# Start backend
cd /home/ubuntu/finplan/backend
pm2 start server.js --name finplan-api

# Start frontend
cd /home/ubuntu/finplan/frontend
pm2 start npm --name finplan-web -- start

# Save PM2 config so it restarts on reboot
pm2 save
pm2 startup
# Copy and run the command PM2 gives you (starts with sudo env PATH=...)
```

Check status:
```bash
pm2 status
pm2 logs finplan-api
pm2 logs finplan-web
```

---

### Step 8 · Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/finplan
```

Paste:
```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;   # or your domain

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/finplan /etc/nginx/sites-enabled/
sudo nginx -t          # test config — should say "ok"
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

### Step 9 · (Optional) Add a Domain + HTTPS

If you have a domain pointed to your EC2:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
sudo certbot renew --dry-run   # test auto-renewal
```

Update `.env` in backend:
```
CORS_ORIGIN=https://yourdomain.com
```

Update `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

Rebuild frontend and restart PM2:
```bash
cd /home/ubuntu/finplan/frontend
npm run build
pm2 restart finplan-web
pm2 restart finplan-api
```

---

### Step 10 · Verify Deployment

1. Open http://YOUR_EC2_PUBLIC_IP in your browser
2. You should see the FinPlan dashboard with Luhadia Clothing Company
3. Health check: http://YOUR_EC2_PUBLIC_IP/api/health → `{"status":"ok"}`

---

## COMMON ISSUES

| Problem | Fix |
|---|---|
| Port 3000/4000 not accessible | Check EC2 Security Group inbound rules |
| DB connection refused | Check RDS security group allows EC2's IP on 3306 |
| PM2 app crashes | Run `pm2 logs` to see the error |
| Nginx 502 Bad Gateway | App not running — check `pm2 status` |
| CORS errors in browser | Update `CORS_ORIGIN` in backend `.env` to match your domain |
| "Cannot find module" | Run `npm install` again in that directory |

---

## MAINTENANCE COMMANDS

```bash
# Deploy new code
git pull origin main
cd frontend && npm run build && pm2 restart finplan-web
pm2 restart finplan-api

# View logs
pm2 logs --lines 100

# Restart everything
pm2 restart all

# Monitor resources
pm2 monit
```
