#!/bin/bash

# Setup automated cron jobs
echo "Setting up automated tasks..."

# Laravel scheduler (runs every minute)
(crontab -l 2>/dev/null; echo "* * * * * cd /var/www/nextgen-perfumes/nextgen-perfumes-backend && php artisan schedule:run >> /dev/null 2>&1") | crontab -

# System monitoring (every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /var/www/nextgen-perfumes/automation/monitoring.sh") | crontab -

# Log rotation (daily at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * * find /var/log -name '*.log' -size +100M -exec gzip {} \;") | crontab -

# SSL certificate renewal check (daily at 4 AM)
(crontab -l 2>/dev/null; echo "0 4 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "Cron jobs configured successfully"
crontab -l