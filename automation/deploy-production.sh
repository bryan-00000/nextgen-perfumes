#!/bin/bash
set -e

echo "🚀 NextGen Perfumes Production Deployment"

# Configuration
REPO_URL="https://github.com/bryan-00000/nextgen-perfumes.git"
DEPLOY_DIR="/var/www/nextgen-perfumes"
BACKUP_DIR="/var/backups/nextgen-perfumes"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
mysqldump -u root -p nextgen_perfumes > $BACKUP_DIR/db_$DATE.sql
tar -czf $BACKUP_DIR/files_$DATE.tar.gz $DEPLOY_DIR/nextgen-perfumes-backend/storage

# Pull latest code
echo "📥 Pulling latest code..."
cd $DEPLOY_DIR
git pull origin main

# Backend deployment
echo "🔧 Deploying backend..."
cd nextgen-perfumes-backend
composer install --no-dev --optimize-autoloader
php artisan down --message="Updating application"
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
php artisan up

# Frontend deployment
echo "🎨 Deploying frontend..."
cd ../nextgen-perfumes-frontend
npm ci --production

# Restart services
echo "🔄 Restarting services..."
sudo systemctl reload nginx
sudo systemctl restart php8.1-fpm

# Health check
echo "🏥 Running health check..."
sleep 5
curl -f http://localhost/api/health || {
    echo "❌ Health check failed! Rolling back..."
    php artisan down
    exit 1
}

echo "✅ Deployment completed successfully!"
echo "📊 Deployment summary:"
echo "  - Time: $(date)"
echo "  - Backup: $BACKUP_DIR/db_$DATE.sql"
echo "  - Status: Live"