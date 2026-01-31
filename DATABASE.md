# Database Configuration - Ypilo.com

## Overview
Ypilo.com uses PostgreSQL as its primary database with Prisma ORM for schema management and migrations.

## Database Schema

### Tables

#### User
Stores user account information including OAuth providers.

#### Session
Manages user sessions for authentication.

#### Project
Stores user-created projects with AI-generated configurations.

#### VerificationToken
Used for email verification and password resets.

#### ChatMessage (if applicable)
Stores chat messages for support functionality.

## Connection Configuration

### Production Database URL
```
postgresql://postgres:password@localhost:5432/itsolutions?sslmode=disable
```

### Environment Variable
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/itsolutions?sslmode=disable"
```

## Prisma Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Migrations
```bash
# Run all pending migrations
npx prisma migrate deploy

# Create a new migration (development)
npx prisma migrate dev --name migration_name
```

### 4. Database Studio
```bash
# Open Prisma Studio to view/edit data
npx prisma studio
```

## Database Backup

### Manual Backup
```bash
# Create backup with timestamp
pg_dump -U postgres -h localhost itsolutions > backup_$(date +%Y%m%d_%H%M%S).sql

# Create compressed backup
pg_dump -U postgres -h localhost itsolutions | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Automated Backup Script
```bash
#!/bin/bash
# /usr/local/bin/backup_ypilo_db.sh

# Configuration
DB_NAME="itsolutions"
DB_USER="postgres"
BACKUP_DIR="/backup/ypilo"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/ypilo_db_$DATE.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

### Schedule Automated Backups
```bash
# Add to crontab
crontab -e

# Run daily at 2 AM
0 2 * * * /usr/local/bin/backup_ypilo_db.sh >> /var/log/ypilo_backup.log 2>&1
```

## Database Restore

### From SQL File
```bash
# Restore from uncompressed backup
psql -U postgres -h localhost itsolutions < backup_file.sql

# Restore from compressed backup
gunzip -c backup_file.sql.gz | psql -U postgres -h localhost itsolutions
```

### Complete Restore Process
```bash
# 1. Drop existing database (CAUTION: This deletes all data!)
sudo -u postgres psql -c "DROP DATABASE IF EXISTS itsolutions;"

# 2. Create fresh database
sudo -u postgres psql -c "CREATE DATABASE itsolutions;"

# 3. Restore from backup
psql -U postgres -h localhost itsolutions < backup_file.sql

# 4. Regenerate Prisma client
cd /srv/COMPANY
npx prisma generate

# 5. Restart application
pm2 restart ypilo
```

## Database Maintenance

### Analyze and Vacuum
```bash
# Analyze tables for query optimization
sudo -u postgres psql -d itsolutions -c "ANALYZE;"

# Vacuum to reclaim storage
sudo -u postgres psql -d itsolutions -c "VACUUM;"

# Full vacuum (requires more time)
sudo -u postgres psql -d itsolutions -c "VACUUM FULL;"
```

### Check Database Size
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Check database size
SELECT pg_database.datname, 
       pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'itsolutions';

# Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Connection Issues

#### Test Database Connection
```bash
# Test with psql
psql -h localhost -U postgres -d itsolutions

# Test with Node.js script
node check-db.js
```

#### Common Connection Errors

**Error: "password authentication failed"**
```bash
# Reset postgres password
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password';
\q

# Update .env file with new password
```

**Error: "database does not exist"**
```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE itsolutions;"
```

**Error: "connection refused"**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql
```

### Migration Issues

**Error: "Migration failed"**
```bash
# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# Or force deploy migrations
npx prisma migrate deploy --skip-generate
```

**Error: "Schema out of sync"**
```bash
# Pull current database schema
npx prisma db pull

# Push schema changes
npx prisma db push
```

### Performance Issues

#### Check Slow Queries
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s
SELECT pg_reload_conf();

-- View log file
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### Add Indexes
```sql
-- Example: Add index on frequently queried column
CREATE INDEX idx_projects_user_id ON "Project"("userId");
CREATE INDEX idx_projects_created_at ON "Project"("createdAt");
```

### Data Recovery

#### Recover from Emergency State
If your server is in emergency mode (like /mnt/system/):
```bash
# 1. Backup current data
pg_dump -U postgres -h localhost itsolutions > emergency_backup.sql

# 2. After system recovery, restore data
psql -U postgres -h localhost itsolutions < emergency_backup.sql
```

## Security Best Practices

### 1. Strong Passwords
```bash
# Generate strong password
openssl rand -base64 32
```

### 2. Restrict Access
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Allow only local connections
local   all             postgres                                md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3. Enable SSL (Optional)
```bash
# Enable SSL in postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Set:
ssl = on
ssl_cert_file = '/path/to/cert.pem'
ssl_key_file = '/path/to/key.pem'

# Update DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/itsolutions?sslmode=require"
```

### 4. Regular Backups
- Daily automated backups
- Off-site backup storage
- Test restore procedures regularly
- Keep at least 30 days of backups

## Monitoring

### Database Activity
```sql
-- Active connections
SELECT * FROM pg_stat_activity WHERE datname = 'itsolutions';

-- Database stats
SELECT * FROM pg_stat_database WHERE datname = 'itsolutions';

-- Table stats
SELECT * FROM pg_stat_user_tables;
```

### Disk Space
```bash
# Check PostgreSQL data directory
du -sh /var/lib/postgresql/14/main

# Check backup directory
du -sh /backup/ypilo
```

## Migration from Emergency State

If restoring from emergency state (/mnt/system/):

```bash
# 1. Export data from emergency location
pg_dump -U postgres -h localhost itsolutions > emergency_backup.sql

# 2. After Ubuntu reinstall, setup fresh PostgreSQL
sudo apt install postgresql

# 3. Create database
sudo -u postgres psql -c "CREATE DATABASE itsolutions;"

# 4. Import data
psql -U postgres itsolutions < emergency_backup.sql

# 5. Deploy application to normal location
cd /srv/COMPANY
npx prisma generate
pm2 restart ypilo
```

---

Last Updated: January 2025
