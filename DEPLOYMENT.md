# Deployment Guide - Ypilo.com

Complete deployment guide for setting up Ypilo.com on Ubuntu server from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Database Setup](#database-setup)
4. [Application Setup](#application-setup)
5. [SSL Configuration](#ssl-configuration)
6. [Process Management](#process-management)
7. [Monitoring & Logs](#monitoring--logs)

## Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or later
- Node.js 18+ 
- PostgreSQL 14+
- Nginx
- PM2 (Process Manager)
- Certbot (for SSL certificates)

### Domain Requirements
- Domain pointed to your server IP
- DNS A records configured

## Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version
```

### 3. Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
```

### 4. Install Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
sudo systemctl status nginx
```

### 5. Install PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command
```

### 6. Install Certbot (for SSL)
```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

## Database Setup

### 1. Create Database and User
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE itsolutions;

# Create user with password
CREATE USER postgres WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE itsolutions TO postgres;

# Exit psql
\q
```

### 2. Configure PostgreSQL
```bash
# Edit PostgreSQL config to allow local connections
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line (if not exists):
# local   all             postgres                                md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Application Setup

### 1. Clone Repository
```bash
# Create application directory
sudo mkdir -p /srv/COMPANY
sudo chown -R $USER:$USER /srv/COMPANY

# Clone repository
cd /srv/COMPANY
git clone https://github.com/EvgeniiBorvinskii/Ypilo.git .
```

### 2. Install Dependencies
```bash
cd /srv/COMPANY
npm install
```

### 3. Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your actual credentials
nano .env
```

Required environment variables:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/itsolutions?sslmode=disable"
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
GROQ_API_KEY=your_groq_api_key
NEXTAUTH_URL=https://ypilo.com
NEXTAUTH_SECRET=generate_a_32_char_random_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
```

### 4. Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed database if needed
# npm run seed
```

### 5. Build Application
```bash
# Build Next.js application
npm run build
```

## SSL Configuration

### 1. Obtain SSL Certificate
```bash
# Request SSL certificate from Let's Encrypt
sudo certbot --nginx -d ypilo.com -d www.ypilo.com

# Follow the prompts
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS
```

### 2. Configure Nginx
```bash
# Copy nginx configuration
sudo cp ypilo_nginx.conf /etc/nginx/sites-available/ypilo.com

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ypilo.com /etc/nginx/sites-enabled/

# Remove default configuration (if needed)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 3. Auto-Renewal Setup
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job or systemd timer
# Verify it's active:
sudo systemctl status certbot.timer
```

## Process Management

### 1. Start Application with PM2
```bash
cd /srv/COMPANY

# Start application using ecosystem config
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot (if not done already)
pm2 startup
# Run the command it provides
```

### 2. PM2 Commands
```bash
# View running processes
pm2 list

# View logs
pm2 logs

# Restart application
pm2 restart ypilo

# Stop application
pm2 stop ypilo

# Monitor resources
pm2 monit

# View detailed info
pm2 show ypilo
```

## Monitoring & Logs

### Application Logs
```bash
# PM2 logs (real-time)
pm2 logs ypilo

# PM2 logs (last 100 lines)
pm2 logs ypilo --lines 100

# PM2 error logs only
pm2 logs ypilo --err

# Clear PM2 logs
pm2 flush
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/ypilo.com-access.log

# Error logs
sudo tail -f /var/log/nginx/ypilo.com-error.log
```

### PostgreSQL Logs
```bash
# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### System Logs
```bash
# System journal for errors
sudo journalctl -xe

# Nginx errors
sudo journalctl -u nginx -n 50

# PostgreSQL errors
sudo journalctl -u postgresql -n 50
```

## Troubleshooting

### Application Won't Start
1. Check environment variables: `cat .env`
2. Check database connection: `npm run db:check`
3. Check PM2 logs: `pm2 logs ypilo --lines 50`
4. Rebuild application: `npm run build && pm2 restart ypilo`

### Database Connection Issues
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check database exists: `sudo -u postgres psql -l`
3. Test connection: `psql -h localhost -U postgres -d itsolutions`
4. Check firewall: `sudo ufw status`

### SSL Certificate Issues
1. Test renewal: `sudo certbot renew --dry-run`
2. Check certificate: `sudo certbot certificates`
3. Verify nginx config: `sudo nginx -t`
4. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Check what's using port 80
sudo lsof -i :80

# Check what's using port 443
sudo lsof -i :443

# Kill process if needed
sudo kill -9 <PID>
```

## Backup & Restore

### Database Backup
```bash
# Create backup
pg_dump -U postgres itsolutions > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -U postgres itsolutions < backup_file.sql
```

### Application Backup
```bash
# Backup application files
tar -czf ypilo_backup_$(date +%Y%m%d).tar.gz /srv/COMPANY

# Restore application
tar -xzf ypilo_backup_YYYYMMDD.tar.gz -C /
```

### Automated Backups
```bash
# Create backup script
nano /usr/local/bin/backup_ypilo.sh

# Add backup commands and schedule with cron
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup_ypilo.sh
```

## Updates & Maintenance

### Update Application
```bash
cd /srv/COMPANY

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart ypilo
```

### Update System Packages
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Restart services if needed
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

## Security Checklist

- [ ] Firewall configured (ufw)
- [ ] SSH key authentication only (disable password)
- [ ] Strong database passwords
- [ ] Environment variables secured
- [ ] SSL certificates installed
- [ ] Regular backups scheduled
- [ ] Monitoring setup
- [ ] Log rotation configured
- [ ] Non-root user for deployment
- [ ] Security updates enabled

## Support

For issues or questions:
- GitHub: https://github.com/EvgeniiBorvinskii/Ypilo
- Email: your-email@example.com

---

Last Updated: January 2025
