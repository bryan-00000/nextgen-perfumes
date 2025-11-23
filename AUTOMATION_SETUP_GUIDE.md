# NextGen Perfumes - Complete Automation Setup Guide

## Prerequisites
- Git repository with automation files
- Production server (AWS EC2, DigitalOcean, etc.)
- Domain name (optional, can use IP)
- SSH access to server

## 1. Local Development Setup

### Remove Sensitive Files
```bash
# In project root
git rm nextgen-perfumes-backend/.env
git commit -m "Remove .env from repository"
git push origin main
```

### Setup Local Environment
```bash
# Create local environment file
cp nextgen-perfumes-backend/.env.example nextgen-perfumes-backend/.env

# Edit .env with local settings
nano nextgen-perfumes-backend/.env

# Install dependencies
make install

# Start development environment
make dev
```

**Access:** http://localhost:3000

## 2. Production Server Setup

### Initial Server Configuration
```bash
# SSH into server
ssh user@your-server-ip

# Clone repository
cd /var/www
sudo git clone https://github.com/bryan-00000/nextgen-perfumes.git
sudo chown -R $USER:$USER nextgen-perfumes
cd nextgen-perfumes

# Make scripts executable
chmod +x automation/*.sh
```

### Run Server Setup Script
```bash
# Complete server setup (installs nginx, mysql, php, etc.)
sudo ./automation/setup-server.sh
```

### Configure Production Environment
```bash
# Create production .env
cp nextgen-perfumes-backend/.env.example nextgen-perfumes-backend/.env

# Edit production settings
nano nextgen-perfumes-backend/.env
```

**Required .env changes:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com  # or http://your-ip
DB_PASSWORD=secure_production_password
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

## 3. SSL Setup (With Domain)

### Automatic SSL Certificate
```bash
# Edit domain in SSL script
nano automation/ssl-setup.sh
# Change DOMAIN="your-actual-domain.com"
# Change EMAIL="your-email@domain.com"

# Run SSL setup
sudo ./automation/ssl-setup.sh
```

### Manual SSL Setup (Alternative)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## 4. IP-Only Setup (No Domain)

### Configure Nginx for IP Access
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/nextgen-perfumes
```

**Replace server_name with IP:**
```nginx
server {
    listen 80;
    server_name your-server-ip;
    # Remove all SSL configurations
}
```

```bash
# Restart nginx
sudo systemctl restart nginx
```

## 5. Automation Setup

### Setup All Automated Tasks
```bash
# Setup cron jobs, monitoring, backups
sudo make setup-automation

# Or manually:
sudo ./automation/cron-setup.sh
```

### Verify Cron Jobs
```bash
# Check scheduled tasks
crontab -l

# Should show:
# * * * * * cd /var/www/nextgen-perfumes/nextgen-perfumes-backend && php artisan schedule:run
# */5 * * * * /var/www/nextgen-perfumes/automation/monitoring.sh
# 0 3 * * * find /var/log -name '*.log' -size +100M -exec gzip {} \;
# 0 4 * * * /usr/bin/certbot renew --quiet
```

## 6. GitHub Actions Setup

### Configure Repository Secrets
**Go to GitHub → Settings → Secrets and variables → Actions**

Add these secrets:
- `PRODUCTION_HOST` = your-server-ip-or-domain
- `PRODUCTION_USER` = ubuntu (or your SSH username)
- `PRODUCTION_SSH_KEY` = your-private-ssh-key-content
- `PRODUCTION_URL` = https://your-domain.com (or http://your-ip)

### Test Automated Deployment
```bash
# Make any change and push
git add .
git commit -m "Test automated deployment"
git push origin main

# Check GitHub Actions tab for deployment status
```

## 7. Database Setup

### Create Production Database
```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE nextgen_perfumes;
CREATE USER 'nextgen'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON nextgen_perfumes.* TO 'nextgen'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Run Migrations
```bash
cd /var/www/nextgen-perfumes/nextgen-perfumes-backend
php artisan migrate
php artisan db:seed  # Optional: add sample data
```

## 8. Email Configuration

### Gmail SMTP Setup
1. Enable 2-factor authentication on Gmail
2. Generate App Password: Google Account → Security → App passwords
3. Use App Password in .env MAIL_PASSWORD

### Test Email
```bash
# Test inventory alerts
php artisan inventory:check
```

## 9. Monitoring Setup

### Configure Monitoring
```bash
# Edit monitoring script
nano automation/monitoring.sh
# Update ALERT_EMAIL="your-admin-email@domain.com"

# Test monitoring
./automation/monitoring.sh
```

### Setup Log Monitoring
```bash
# Create log directory
sudo mkdir -p /var/log/nextgen-perfumes
sudo chown www-data:www-data /var/log/nextgen-perfumes

# Test log rotation
sudo logrotate -f /etc/logrotate.conf
```

## 10. Testing & Verification

### Test All Components
```bash
# Check service status
make status

# Test API health
curl http://your-domain.com/api/health

# Check monitoring
make monitor

# Test backup
make backup

# View logs
make logs

# Security scan
make security-scan
```

### Verify Automation
```bash
# Check Laravel scheduler
php artisan schedule:list

# Test inventory command
php artisan inventory:check

# Check cron jobs are running
sudo tail -f /var/log/syslog | grep CRON
```

## 11. Daily Operations

### Regular Commands
```bash
# Check system health
make status

# View application logs
make logs

# Manual backup
make backup

# Security scan
make security-scan

# Deploy latest changes
git push origin main  # Automatic via GitHub Actions
```

### Troubleshooting
```bash
# Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm

# Check service status
sudo systemctl status nginx
sudo systemctl status php8.1-fpm

# View error logs
sudo tail -f /var/log/nginx/error.log
tail -f nextgen-perfumes-backend/storage/logs/laravel.log
```

## 12. Rollback Procedure

### Emergency Rollback
```bash
# List available backups
ls -la /var/backups/nextgen-perfumes/

# Run rollback script
sudo ./automation/rollback.sh
# Enter backup date when prompted
```

### Manual Rollback
```bash
# Put site in maintenance
php artisan down

# Restore database
mysql -u root -p nextgen_perfumes < /var/backups/db_YYYYMMDD.sql

# Restore files if needed
tar -xzf /var/backups/files_YYYYMMDD.tar.gz -C /

# Bring site back up
php artisan up
```

## Security Checklist

- [ ] .env file not in repository
- [ ] Strong database passwords
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Regular security scans enabled
- [ ] Backup strategy tested
- [ ] Monitoring alerts configured
- [ ] Rate limiting enabled
- [ ] Access logs monitored

## Maintenance Schedule

- **Every 5 minutes**: API health checks, performance monitoring
- **Hourly**: Inventory level checks, low stock alerts
- **Daily 2 AM**: Database backup
- **Daily 3 AM**: Log rotation and cleanup
- **Daily 4 AM**: SSL certificate renewal check
- **Weekly**: Security vulnerability scans
- **Monthly**: Full system backup verification

## Support Contacts

- **System Admin**: your-admin-email@domain.com
- **Developer**: your-dev-email@domain.com
- **Emergency**: your-emergency-contact

---

**Last Updated**: $(date)
**Version**: 1.0.0